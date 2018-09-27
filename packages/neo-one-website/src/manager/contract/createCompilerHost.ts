import { CompilerHost } from '@neo-one/smart-contract-compiler';
import { normalizePath, utils } from '@neo-one/utils';
import ts from 'typescript';
import { EditorFile } from '../../types';
import { getSmartContractLibPath, getSmartContractPath } from '../utils';
import { CompilerHostOptions } from './types';

export const createCompilerHost = ({ files: filesIn }: CompilerHostOptions): CompilerHost => {
  const files = filesIn.filter((file) => file.type === 'contract');

  return {
    getAllTypescriptFilesInDir: async (dir: string) =>
      files.filter((file) => file.path.startsWith(dir)).map((file) => file.path),
    createSnippetFile: (fileName = 'snippetCode.ts') => fileName,
    getSmartContractPath,
    getSmartContractLibPath,
    createLanguageServiceHost(
      rootNamesIn: ReadonlyArray<string>,
      options: ts.CompilerOptions,
      withTestHarness = false,
    ): ts.LanguageServiceHost {
      const smartContractModule = this.getSmartContractPath('index.d.ts');
      const smartContractFiles = [
        this.getSmartContractPath('global.d.ts'),
        smartContractModule,
        withTestHarness ? this.getSmartContractPath('harness.d.ts') : undefined,
      ].filter(utils.notNull);

      const rootNames = [...new Set(rootNamesIn.concat(smartContractFiles))].map(normalizePath);

      const fileMap = new Map<string, EditorFile>();
      files.forEach((file) => {
        fileMap.set(file.path, file);
      });

      const fileExists = (fileName: string) => fileMap.has(fileName);
      // tslint:disable-next-line no-non-null-assertion
      const readFile = (fileName: string) => fileMap.get(fileName)!.content;
      const readDirectory = (fileName: string) => [
        ...new Set(files.filter((file) => file.path.startsWith(fileName)).map((file) => file.path.split('/')[0])),
      ];

      const smartContractLibModule = this.getSmartContractLibPath('index.ts');
      function resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
        const mutableResolvedModules: ts.ResolvedModule[] = [];
        // tslint:disable-next-line no-loop-statement
        for (const moduleName of moduleNames) {
          // tslint:disable-next-line prefer-switch
          if (moduleName === '@neo-one/smart-contract') {
            mutableResolvedModules.push({ resolvedFileName: smartContractModule });
          } else if (moduleName === '@neo-one/smart-contract-lib') {
            mutableResolvedModules.push({ resolvedFileName: smartContractLibModule });
          } else {
            const result = ts.resolveModuleName(moduleName, containingFile, options, {
              fileExists,
              readFile,
            });
            // tslint:disable-next-line no-non-null-assertion
            mutableResolvedModules.push(result.resolvedModule!);
          }
        }

        return mutableResolvedModules;
      }

      const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => [...rootNames],
        getScriptVersion: () => '0',
        getScriptSnapshot: (fileName) => {
          // tslint:disable-next-line no-non-null-assertion
          if (!servicesHost.fileExists!(fileName)) {
            return undefined;
          }

          // tslint:disable-next-line no-non-null-assertion
          return ts.ScriptSnapshot.fromString(servicesHost.readFile!(fileName)!);
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        getNewLine: () => ts.sys.newLine,
        fileExists,
        readFile,
        readDirectory,
        resolveModuleNames,
      };

      return servicesHost;
    },
  };
};
