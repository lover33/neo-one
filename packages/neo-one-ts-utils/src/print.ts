import commondir from 'commondir';
import { RawSourceMap } from 'source-map';
import ts from 'typescript';
import * as file_ from './file';

interface Result {
  readonly text: string;
  readonly sourceMap: RawSourceMap;
}
export const print = (programIn: ts.Program, original: ts.SourceFile, file: ts.SourceFile): Result => {
  // tslint:disable-next-line no-any
  const program: any = programIn;
  // tslint:disable-next-line no-any
  const compiler: any = ts;

  const host = {
    getPrependNodes: () => [],
    getCanonicalFileName: (fileName: string) => (ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()),
    getCommonSourceDirectory: program.getCommonSourceDirectory,
    getCompilerOptions: program.getCompilerOptions,
    getCurrentDirectory: program.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
    getSourceFile: program.getSourceFile,
    getSourceFileByPath: program.getSourceFileByPath,
    getSourceFiles: program.getSourceFiles,
    isSourceFileFromExternalLibrary: program.isSourceFileFromExternalLibrary,
    writeFile: ts.sys.writeFile,
    readFile: ts.sys.readFile,
    fileExists: ts.sys.fileExists,
    directoryExists: ts.sys.directoryExists,
  };
  const writer = compiler.createTextWriter(ts.sys.newLine);
  const sourceMap = compiler.createSourceMapWriter(host, writer, {
    ...program.getCompilerOptions(),
    sourceRoot: commondir([...programIn.getRootFileNames()]),
    sourceMap: true,
  });
  sourceMap.initialize(file.fileName, `${file.fileName}.map`);

  const printer = compiler.createPrinter(
    { ...program.getCompilerOptions() },
    {
      onEmitSourceMapOfNode: sourceMap.emitNodeWithSourceMap,
      onEmitSourceMapOfToken: sourceMap.emitTokenWithSourceMap,
      onEmitSourceMapOfPosition: sourceMap.emitPos,
      onSetSourceFile: sourceMap.setSourceFile,
    },
  );

  printer.writeFile(file, writer);

  return {
    text: writer.getText(),
    sourceMap: {
      ...JSON.parse(sourceMap.getText()),
      sourcesContent: [original.getFullText()],
    },
  };
};

export const printBundle = (
  programIn: ts.Program,
  files: ReadonlyArray<ts.SourceFile>,
  substituteNode: (hint: ts.EmitHint, node: ts.Node) => ts.Node,
): Result => {
  // tslint:disable-next-line no-any
  const program: any = programIn;
  // tslint:disable-next-line no-any
  const compiler: any = ts;

  const host = {
    getPrependNodes: () => [],
    getCanonicalFileName: (fileName: string) => (ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()),
    getCommonSourceDirectory: program.getCommonSourceDirectory,
    getCompilerOptions: program.getCompilerOptions,
    getCurrentDirectory: program.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
    getSourceFile: program.getSourceFile,
    getSourceFileByPath: program.getSourceFileByPath,
    getSourceFiles: program.getSourceFiles,
    isSourceFileFromExternalLibrary: program.isSourceFileFromExternalLibrary,
    writeFile: ts.sys.writeFile,
    readFile: ts.sys.readFile,
    fileExists: ts.sys.fileExists,
    directoryExists: ts.sys.directoryExists,
  };
  const writer = compiler.createTextWriter(ts.sys.newLine);
  const sourceMap = compiler.createSourceMapWriter(host, writer, {
    ...program.getCompilerOptions(),
    sourceRoot: commondir([...programIn.getRootFileNames()]),
    sourceMap: true,
  });
  files.forEach((file) => {
    sourceMap.initialize(file.fileName, `${file.fileName}.map`);
  });

  const printer = compiler.createPrinter(
    { ...program.getCompilerOptions(), outFile: 'foo.ts' },
    {
      onEmitSourceMapOfNode: sourceMap.emitNodeWithSourceMap,
      onEmitSourceMapOfToken: sourceMap.emitTokenWithSourceMap,
      onEmitSourceMapOfPosition: sourceMap.emitPos,
      onSetSourceFile: sourceMap.setSourceFile,

      substituteNode,
    },
  );

  printer.writeBundle(ts.createBundle(files), writer);

  const resolvedSourceMap: RawSourceMap = JSON.parse(sourceMap.getText());

  return {
    text: writer.getText(),
    sourceMap: {
      ...resolvedSourceMap,
      sourcesContent: resolvedSourceMap.sources.map((filePath) => {
        const foundFile = files.find((file) => file_.getFilePath(file).endsWith(filePath));

        return foundFile === undefined ? '' : file_.getText(foundFile);
      }),
    },
  };
};

export const markOriginal = <T extends ts.Node>(node: T): T => {
  // tslint:disable-next-line no-any no-object-mutation
  (node as any).__originalSet = true;

  return ts.setSourceMapRange(node, file_.createSourceMapRange(node));
};

export const setOriginal = <T extends ts.Node>(node: T, original: ts.Node): T => {
  // tslint:disable-next-line no-any
  if (!(node as any).__originalSet) {
    const transformedNode = ts.moveSyntheticComments(
      ts.setSourceMapRange(ts.setOriginalNode(node, original), file_.createSourceMapRange(original)),
      original,
    );

    // tslint:disable-next-line no-any no-object-mutation
    (node as any).__originalSet = true;

    return transformedNode;
  }

  return node;
};

// tslint:disable-next-line no-any
export const isOriginal = (node: ts.Node): boolean => !(node as any).__originalSet;

const context: ts.TransformationContext = {
  // tslint:disable-next-line no-any
  getCompilerOptions: (): ts.CompilerOptions => ({} as any),
  startLexicalEnvironment: (): void => {
    // do nothing
  },
  suspendLexicalEnvironment: (): void => {
    // do nothing
  },
  resumeLexicalEnvironment: (): void => {
    // do nothing
  },

  endLexicalEnvironment: () => undefined,
  hoistFunctionDeclaration: (): void => {
    // do nothing
  },
  hoistVariableDeclaration: (): void => {
    // do nothing
  },
  requestEmitHelper: (): void => {
    // do nothing
  },
  readEmitHelpers: () => undefined,
  enableSubstitution: (): void => {
    // do nothing
  },
  isSubstitutionEnabled: (): boolean => false,
  onSubstituteNode: (_hint, node) => node,
  enableEmitNotification: (): void => {
    // do nothing
  },
  isEmitNotificationEnabled: (): boolean => false,
  onEmitNode: (hint, node, emitCallback) => {
    emitCallback(hint, node);
  },
};

export const setOriginalRecursive = <T extends ts.Node>(start: T, original: ts.Node): T => {
  const seen = new Set();

  function visit(node: ts.Node): ts.VisitResult<ts.Node> {
    if (seen.has(node)) {
      return node;
    }
    seen.add(node);

    const transformedNode = setOriginal(node, original);

    return ts.visitEachChild(transformedNode, visit, context);
  }

  return visit(start) as T;
};
