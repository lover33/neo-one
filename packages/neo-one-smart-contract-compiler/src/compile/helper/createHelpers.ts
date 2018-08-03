import {
  ArrFilterFuncHelper,
  ArrFilterHelper,
  ArrFilterHelperOptions,
  ArrMapFuncHelper,
  ArrMapHelper,
  ArrMapHelperOptions,
} from './arr';
import {
  CreateArrayHelper,
  GetArrayIndexHelper,
  GetArrayValueHelper,
  IsArrayHelper,
  SetArrayIndexHelper,
  SetArrayValueHelper,
  UnwrapArrayHelper,
  WrapArrayHelper,
} from './array';
import {
  IsBlockchainInterfaceHelper,
  IsBlockchainInterfaceHelperOptions,
  UnwrapBlockchainInterfaceHelper,
  WrapBlockchainInterfaceHelper,
  WrapBlockchainInterfaceHelperOptions,
} from './blockchain';
import {
  CreateBufferHelper,
  GetBufferValueHelper,
  SetBufferValueHelper,
  UnwrapBufferHelper,
  WrapBufferHelper,
} from './buffer';
import {
  ArrForEachHelper,
  ArrForEachHelperOptions,
  ArrSliceHelper,
  ArrSliceHelperOptions,
  CloneArrayHelper,
  ConsoleLogHelper,
  ExpHelper,
  ExtendArrayHelper,
  ForTypeHelper,
  ForTypeHelperOptions,
  GenericDeserializeHelper,
  GenericSerializeHelper,
  TypedHelperOptions,
} from './common';
import {
  BreakHelper,
  ContinueHelper,
  HandleCompletionHelper,
  ReturnHelper,
  ThrowCompletionHelper,
  ThrowHelper,
} from './completionRecord';
import { ThrowTypeErrorHelper } from './error';
import {
  ArgumentsHelper,
  BindFunctionObjectThisHelper,
  BindFunctionObjectThisHelperOptions,
  BindFunctionThisHelper,
  BindFunctionThisHelperOptions,
  CallHelper,
  CallLikeHelper,
  CloneFunctionHelper,
  CloneFunctionObjectHelper,
  CloneFunctionObjectHelperOptions,
  CreateCallArrayHelper,
  CreateConstructArrayHelper,
  CreateConstructArrayHelperOptions,
  CreateFunctionArrayHelper,
  CreateFunctionArrayHelperOptions,
  CreateFunctionObjectHelper,
  CreateFunctionObjectHelperOptions,
  FunctionHelper,
  FunctionHelperOptions,
  FunctionLikeHelper,
  GetCallableHelper,
  GetCallableHelperOptions,
  InvokeCallHelper,
  InvokeCallHelperOptions,
  InvokeConstructHelper,
  InvokeConstructHelperOptions,
  NewHelper,
  NewHelperOptions,
  ParametersHelper,
} from './function';
import {
  AddArgumentsHelper,
  AddArrayObjectHelper,
  AddBooleanObjectHelper,
  AddBufferObjectHelper,
  AddErrorObjectHelper,
  AddMapObjectHelper,
  AddModulesHelper,
  AddNumberObjectHelper,
  AddObjectObjectHelper,
  AddStringObjectHelper,
  AddSymbolObjectHelper,
  GetArgumentHelper,
  GetGlobalPropertyHelper,
  GetGlobalPropertyHelperOptions,
  GLOBAL_PROPERTIES,
  SetGlobalObjectHelper,
} from './global';
import { Helper } from './Helper';
import { KeyedHelper } from './KeyedHelper';
import { CreateMapHelper, GetMapValueHelper, SetMapValueHelper, UnwrapMapHelper, WrapMapHelper } from './map';
import {
  AddEmptyModuleHelper,
  ExportHelper,
  ExportHelperOptions,
  ExportSingleHelper,
  GetCurrentModuleHelper,
  GetModuleHelper,
  GetModuleHelperOptions,
  GetModulesHelper,
} from './module';
import {
  EqualsEqualsEqualsHelper,
  EqualsEqualsEqualsHelperOptions,
  EqualsEqualsEqualsNumberHelper,
  EqualsEqualsEqualsSameTypeHelper,
  EqualsEqualsEqualsUnknownHelper,
  EqualsEqualsHelper,
  EqualsEqualsHelperOptions,
  LessThanHelper,
  LessThanHelperOptions,
} from './relational';
import {
  Case,
  CaseHelper,
  ForLoopHelper,
  ForLoopHelperOptions,
  IfHelper,
  IfHelperOptions,
  ProcessStatementsHelper,
  ProcessStatementsHelperOptions,
} from './statement';
import {
  CreateBooleanHelper,
  CreateNullHelper,
  CreateNumberHelper,
  CreateObjectHelper,
  CreatePropertyObjectHelper,
  CreateStringHelper,
  CreateSymbolHelper,
  CreateUndefinedHelper,
  ElementAccessHelper,
  FindObjectPropertyHelper,
  FindObjectPropertyHelperBase,
  FindObjectPropertyHelperBaseOptions,
  FindObjectPropertyHelperOptions,
  GetBooleanHelper,
  GetInternalObjectHelper,
  GetInternalObjectPropertyHelper,
  GetNumberHelper,
  GetObjectHelper,
  GetPropertyObjectHelper,
  GetPropertyObjectKeysHelper,
  GetPropertyObjectPropertyHelper,
  GetStringHelper,
  GetSymbolHelper,
  GetSymbolObjectHelper,
  GetSymbolObjectPropertyHelper,
  InObjectPropertyHelper,
  InObjectPropertyHelperOptions,
  InPropertyObjectPropertyHelper,
  InstanceofHelper,
  InSymbolObjectPropertyHelper,
  IsBooleanHelper,
  IsNullHelper,
  IsNullOrUndefinedHelper,
  IsNumberHelper,
  IsObjectHelper,
  IsSameTypeHelper,
  IsStringHelper,
  IsSymbolHelper,
  IsUndefinedHelper,
  OmitObjectPropertiesHelper,
  OmitPropertyObjectPropertiesHelper,
  OmitSymbolObjectPropertiesHelper,
  PackObjectHelper,
  PickObjectPropertiesHelper,
  PickPropertyObjectPropertiesHelper,
  PickSymbolObjectPropertiesHelper,
  SetAccessorPropertyObjectPropertyHelper,
  SetAccessorSymbolObjectPropertyHelper,
  SetDataPropertyObjectPropertyHelper,
  SetDataSymbolObjectPropertyHelper,
  SetInternalObjectPropertyHelper,
  SetObjectAccessorPropertyHelperBaseOptions,
  SetPropertyObjectPropertyHelper,
  SetSymbolObjectPropertyHelper,
  ShallowCloneObjectHelper,
  ShallowCloneObjHelper,
  ToBooleanHelper,
  ToNumberHelper,
  ToObjectHelper,
  ToPrimitiveHelper,
  ToPrimitiveHelperOptions,
  ToStringHelper,
  UnwrapTypeHelper,
  UnwrapValHelper,
} from './types';

export interface Helpers {
  readonly arrFilter: (options: ArrFilterHelperOptions) => ArrFilterHelper;
  readonly arrFilterFunc: ArrFilterFuncHelper;
  readonly arrMap: (options: ArrMapHelperOptions) => ArrMapHelper;
  readonly arrMapFunc: ArrMapFuncHelper;

  readonly arrForEach: (options: ArrForEachHelperOptions) => ArrForEachHelper;
  readonly arrSlice: (options?: ArrSliceHelperOptions) => ArrSliceHelper;
  readonly cloneArray: CloneArrayHelper;
  readonly extendArray: ExtendArrayHelper;
  readonly forType: (options: ForTypeHelperOptions) => ForTypeHelper;
  readonly genericDeserialize: GenericDeserializeHelper;
  readonly genericSerialize: GenericSerializeHelper;
  readonly exp: ExpHelper;
  readonly consoleLog: ConsoleLogHelper;

  readonly equalsEqualsEquals: (options: EqualsEqualsEqualsHelperOptions) => EqualsEqualsEqualsHelper;
  readonly equalsEqualsEqualsNumber: EqualsEqualsEqualsNumberHelper;
  readonly equalsEqualsEqualsSameType: EqualsEqualsEqualsSameTypeHelper;
  readonly equalsEqualsEqualsUnknown: EqualsEqualsEqualsUnknownHelper;
  readonly equalsEquals: (options: EqualsEqualsHelperOptions) => EqualsEqualsHelper;
  readonly lessThan: (options: LessThanHelperOptions) => LessThanHelper;
  readonly processStatements: (options: ProcessStatementsHelperOptions) => ProcessStatementsHelper;

  readonly args: ArgumentsHelper;
  readonly bindFunctionObjectThis: (options: BindFunctionObjectThisHelperOptions) => BindFunctionObjectThisHelper;
  readonly bindFunctionThis: (options: BindFunctionThisHelperOptions) => BindFunctionThisHelper;
  readonly call: CallHelper;
  readonly callLike: CallLikeHelper;
  readonly cloneFunction: CloneFunctionHelper;
  readonly cloneFunctionObject: (options: CloneFunctionObjectHelperOptions) => CloneFunctionObjectHelper;
  readonly createCallArray: CreateCallArrayHelper;
  readonly createConstructArray: (options: CreateConstructArrayHelperOptions) => CreateConstructArrayHelper;
  readonly createFunctionArray: (options: CreateFunctionArrayHelperOptions) => CreateFunctionArrayHelper;
  readonly createFunctionObject: (options: CreateFunctionObjectHelperOptions) => CreateFunctionObjectHelper;
  readonly function: (options: FunctionHelperOptions) => FunctionHelper;
  readonly functionLike: FunctionLikeHelper;
  readonly getCallable: (options: GetCallableHelperOptions) => GetCallableHelper;
  readonly invokeCall: (options?: InvokeCallHelperOptions) => InvokeCallHelper;
  readonly invokeConstruct: (options?: InvokeConstructHelperOptions) => InvokeConstructHelper;
  readonly new: (options?: NewHelperOptions) => NewHelper;
  readonly parameters: ParametersHelper;

  readonly forLoop: (options: ForLoopHelperOptions) => ForLoopHelper;
  readonly if: (options: IfHelperOptions) => IfHelper;
  readonly case: (cases: ReadonlyArray<Case>, defaultCase: () => void) => CaseHelper;
  readonly handleCompletion: HandleCompletionHelper;
  readonly return: ReturnHelper;
  readonly throw: ThrowHelper;
  readonly break: BreakHelper;
  readonly continue: ContinueHelper;
  readonly throwCompletion: ThrowCompletionHelper;
  readonly throwTypeError: ThrowTypeErrorHelper;
  readonly createBoolean: CreateBooleanHelper;
  readonly createNull: CreateNullHelper;
  readonly createNumber: CreateNumberHelper;
  readonly createObject: CreateObjectHelper;
  readonly createString: CreateStringHelper;
  readonly createSymbol: CreateSymbolHelper;
  readonly createUndefined: CreateUndefinedHelper;
  readonly isBoolean: IsBooleanHelper;
  readonly isNull: IsNullHelper;
  readonly isNumber: IsNumberHelper;
  readonly isObject: IsObjectHelper;
  readonly isString: IsStringHelper;
  readonly isSymbol: IsSymbolHelper;
  readonly isUndefined: IsUndefinedHelper;
  readonly isNullOrUndefined: IsNullOrUndefinedHelper;
  readonly isSameType: IsSameTypeHelper;
  readonly getBoolean: GetBooleanHelper;
  readonly getNumber: GetNumberHelper;
  readonly getString: GetStringHelper;
  readonly getSymbol: GetSymbolHelper;
  readonly getObject: GetObjectHelper;
  readonly toBoolean: (options: TypedHelperOptions) => ToBooleanHelper;
  readonly toString: (options: TypedHelperOptions) => ToStringHelper;
  readonly toNumber: (options: TypedHelperOptions) => ToNumberHelper;
  readonly toObject: (options: TypedHelperOptions) => ToObjectHelper;
  readonly toPrimitive: (options: ToPrimitiveHelperOptions) => ToPrimitiveHelper;
  readonly getSymbolObject: GetSymbolObjectHelper;
  readonly getSymbolObjectProperty: GetSymbolObjectPropertyHelper;
  readonly setSymbolObjectProperty: SetSymbolObjectPropertyHelper;
  readonly setDataSymbolObjectProperty: SetDataSymbolObjectPropertyHelper;
  readonly setAccessorSymbolObjectProperty: (
    options: SetObjectAccessorPropertyHelperBaseOptions,
  ) => SetAccessorSymbolObjectPropertyHelper;
  readonly getPropertyObject: GetPropertyObjectHelper;
  readonly getPropertyObjectKeys: GetPropertyObjectKeysHelper;
  readonly getPropertyObjectProperty: GetPropertyObjectPropertyHelper;
  readonly setPropertyObjectProperty: SetPropertyObjectPropertyHelper;
  readonly setDataPropertyObjectProperty: SetDataPropertyObjectPropertyHelper;
  readonly setAccessorPropertyObjectProperty: (
    options: SetObjectAccessorPropertyHelperBaseOptions,
  ) => SetAccessorPropertyObjectPropertyHelper;
  readonly getInternalObject: GetInternalObjectHelper;
  readonly getInternalObjectProperty: GetInternalObjectPropertyHelper;
  readonly setInternalObjectProperty: SetInternalObjectPropertyHelper;
  readonly shallowCloneObject: ShallowCloneObjectHelper;
  readonly shallowCloneObj: ShallowCloneObjHelper;
  readonly elementAccess: ElementAccessHelper;
  readonly unwrapType: UnwrapTypeHelper;
  readonly packObject: PackObjectHelper;
  readonly pickObjectProperties: PickObjectPropertiesHelper;
  readonly pickPropertyObjectProperties: PickPropertyObjectPropertiesHelper;
  readonly pickSymbolObjectProperties: PickSymbolObjectPropertiesHelper;
  readonly omitObjectProperties: OmitObjectPropertiesHelper;
  readonly omitPropertyObjectProperties: OmitPropertyObjectPropertiesHelper;
  readonly omitSymbolObjectProperties: OmitSymbolObjectPropertiesHelper;
  readonly unwrapVal: UnwrapValHelper;
  readonly instanceof: InstanceofHelper;
  readonly inObjectProperty: (options: InObjectPropertyHelperOptions) => InObjectPropertyHelper;
  readonly inPropertyObjectProperty: InPropertyObjectPropertyHelper;
  readonly inSymbolObjectProperty: InSymbolObjectPropertyHelper;
  readonly createPropertyObject: CreatePropertyObjectHelper;
  readonly findObjectProperty: (options: FindObjectPropertyHelperOptions) => FindObjectPropertyHelper;
  readonly findObjectPropertyBase: (options: FindObjectPropertyHelperBaseOptions) => FindObjectPropertyHelperBase;

  readonly getArrayValue: GetArrayValueHelper;
  readonly createArray: CreateArrayHelper;
  readonly setArrayValue: SetArrayValueHelper;
  readonly getArrayIndex: GetArrayIndexHelper;
  readonly setArrayIndex: SetArrayIndexHelper;
  readonly wrapArray: WrapArrayHelper;
  readonly unwrapArray: UnwrapArrayHelper;
  readonly isArray: IsArrayHelper;

  readonly getMapValue: GetMapValueHelper;
  readonly createMap: CreateMapHelper;
  readonly setMapValue: SetMapValueHelper;
  readonly wrapMap: WrapMapHelper;
  readonly unwrapMap: UnwrapMapHelper;

  readonly createBuffer: CreateBufferHelper;
  readonly getBufferValue: GetBufferValueHelper;
  readonly setBufferValue: SetBufferValueHelper;
  readonly unwrapBuffer: UnwrapBufferHelper;
  readonly wrapBuffer: WrapBufferHelper;

  readonly export: (options: ExportHelperOptions) => ExportHelper;
  readonly exportSingle: (options: ExportHelperOptions) => ExportSingleHelper;
  readonly getModule: (options: GetModuleHelperOptions) => GetModuleHelper;
  readonly getCurrentModule: GetCurrentModuleHelper;
  readonly getModules: GetModulesHelper;
  readonly addEmptyModule: AddEmptyModuleHelper;

  readonly isBlockchainInterface: (options: IsBlockchainInterfaceHelperOptions) => IsBlockchainInterfaceHelper;
  readonly wrapBlockchainInterface: (options: WrapBlockchainInterfaceHelperOptions) => WrapBlockchainInterfaceHelper;
  readonly unwrapBlockchainInterface: UnwrapBlockchainInterfaceHelper;

  readonly addArguments: AddArgumentsHelper;
  readonly addArrayObject: AddArrayObjectHelper;
  readonly addBooleanObject: AddBooleanObjectHelper;
  readonly addBufferObject: AddBufferObjectHelper;
  readonly addErrorObject: AddErrorObjectHelper;
  readonly addMapObject: AddMapObjectHelper;
  readonly addModules: AddModulesHelper;
  readonly addNumberObject: AddNumberObjectHelper;
  readonly addObjectObject: AddObjectObjectHelper;
  readonly addStringObject: AddStringObjectHelper;
  readonly addSymbolObject: AddSymbolObjectHelper;
  readonly setGlobalObject: SetGlobalObjectHelper;
  readonly getArgument: (options: TypedHelperOptions) => GetArgumentHelper;
  readonly getGlobalProperty: (options: GetGlobalPropertyHelperOptions) => GetGlobalPropertyHelper;
  readonly globalProperties: Set<string>;
}

export const createHelpers = (): Helpers => {
  const mutableCache: { [K in string]?: Helper } = {};

  function memoized<Options, T extends Helper>(
    helperClass: (new (options: Options) => T) & KeyedHelper<Options>,
  ): (options: Options) => T {
    return (options: Options) => {
      const key = helperClass.getKey(options);
      let value = mutableCache[key];
      if (value === undefined) {
        mutableCache[key] = value = new helperClass(options);
      }

      return value as T;
    };
  }

  return {
    arrFilter: (options) => new ArrFilterHelper(options),
    arrFilterFunc: new ArrFilterFuncHelper(),
    arrMap: (options) => new ArrMapHelper(options),
    arrMapFunc: new ArrMapFuncHelper(),

    arrForEach: (options) => new ArrForEachHelper(options),
    arrSlice: (options = {}) => new ArrSliceHelper(options),
    cloneArray: new CloneArrayHelper(),
    extendArray: new ExtendArrayHelper(),
    forType: (options) => new ForTypeHelper(options),
    genericDeserialize: new GenericDeserializeHelper(),
    genericSerialize: new GenericSerializeHelper(),
    exp: new ExpHelper(),
    consoleLog: new ConsoleLogHelper(),

    equalsEqualsEquals: (options) => new EqualsEqualsEqualsHelper(options),
    equalsEqualsEqualsNumber: new EqualsEqualsEqualsNumberHelper(),
    equalsEqualsEqualsSameType: new EqualsEqualsEqualsSameTypeHelper(),
    equalsEqualsEqualsUnknown: new EqualsEqualsEqualsUnknownHelper(),
    equalsEquals: (options) => new EqualsEqualsHelper(options),
    lessThan: (options) => new LessThanHelper(options),
    processStatements: (options) => new ProcessStatementsHelper(options),

    args: new ArgumentsHelper(),
    bindFunctionObjectThis: (options) => new BindFunctionObjectThisHelper(options),
    bindFunctionThis: (options) => new BindFunctionThisHelper(options),
    call: new CallHelper(),
    callLike: new CallLikeHelper(),
    cloneFunction: new CloneFunctionHelper(),
    cloneFunctionObject: (options) => new CloneFunctionObjectHelper(options),
    createCallArray: new CreateCallArrayHelper(),
    createConstructArray: (options) => new CreateConstructArrayHelper(options),
    createFunctionArray: (options) => new CreateFunctionArrayHelper(options),
    createFunctionObject: (options) => new CreateFunctionObjectHelper(options),
    function: (options) => new FunctionHelper(options),
    functionLike: new FunctionLikeHelper(),
    getCallable: memoized(GetCallableHelper),
    invokeCall: memoized(InvokeCallHelper),
    invokeConstruct: (options?) => new InvokeConstructHelper(options),
    new: (options?) => new NewHelper(options),
    parameters: new ParametersHelper(),

    forLoop: (options) => new ForLoopHelper(options),
    if: (options) => new IfHelper(options),
    case: (cases, defaultCase) => new CaseHelper(cases, defaultCase),
    handleCompletion: new HandleCompletionHelper(),
    return: new ReturnHelper(),
    throw: new ThrowHelper(),
    break: new BreakHelper(),
    continue: new ContinueHelper(),
    throwCompletion: new ThrowCompletionHelper(),
    throwTypeError: new ThrowTypeErrorHelper(),
    createBoolean: new CreateBooleanHelper(),
    createNull: new CreateNullHelper(),
    createNumber: new CreateNumberHelper(),
    createObject: new CreateObjectHelper(),
    createString: new CreateStringHelper(),
    createSymbol: new CreateSymbolHelper(),
    createUndefined: new CreateUndefinedHelper(),
    isBoolean: new IsBooleanHelper(),
    isNull: new IsNullHelper(),
    isNumber: new IsNumberHelper(),
    isObject: new IsObjectHelper(),
    isString: new IsStringHelper(),
    isSymbol: new IsSymbolHelper(),
    isUndefined: new IsUndefinedHelper(),
    isNullOrUndefined: new IsNullOrUndefinedHelper(),
    isSameType: new IsSameTypeHelper(),
    getBoolean: new GetBooleanHelper(),
    getNumber: new GetNumberHelper(),
    getString: new GetStringHelper(),
    getSymbol: new GetSymbolHelper(),
    getObject: new GetObjectHelper(),
    toBoolean: (options) => new ToBooleanHelper(options),
    toString: (options) => new ToStringHelper(options),
    toNumber: (options) => new ToNumberHelper(options),
    toObject: (options) => new ToObjectHelper(options),
    toPrimitive: (options) => new ToPrimitiveHelper(options),
    getSymbolObject: new GetSymbolObjectHelper(),
    getSymbolObjectProperty: new GetSymbolObjectPropertyHelper(),
    setSymbolObjectProperty: new SetSymbolObjectPropertyHelper(),
    setDataSymbolObjectProperty: new SetDataSymbolObjectPropertyHelper(),
    setAccessorSymbolObjectProperty: (options) => new SetAccessorSymbolObjectPropertyHelper(options),
    getPropertyObject: new GetPropertyObjectHelper(),
    getPropertyObjectKeys: new GetPropertyObjectKeysHelper(),
    getPropertyObjectProperty: new GetPropertyObjectPropertyHelper(),
    setPropertyObjectProperty: new SetPropertyObjectPropertyHelper(),
    setDataPropertyObjectProperty: new SetDataPropertyObjectPropertyHelper(),
    setAccessorPropertyObjectProperty: (options) => new SetAccessorPropertyObjectPropertyHelper(options),
    getInternalObject: new GetInternalObjectHelper(),
    getInternalObjectProperty: new GetInternalObjectPropertyHelper(),
    setInternalObjectProperty: new SetInternalObjectPropertyHelper(),
    shallowCloneObject: new ShallowCloneObjectHelper(),
    shallowCloneObj: new ShallowCloneObjHelper(),
    packObject: new PackObjectHelper(),
    pickObjectProperties: new PickObjectPropertiesHelper(),
    pickPropertyObjectProperties: new PickPropertyObjectPropertiesHelper(),
    pickSymbolObjectProperties: new PickSymbolObjectPropertiesHelper(),
    omitObjectProperties: new OmitObjectPropertiesHelper(),
    omitPropertyObjectProperties: new OmitPropertyObjectPropertiesHelper(),
    omitSymbolObjectProperties: new OmitSymbolObjectPropertiesHelper(),
    elementAccess: new ElementAccessHelper(),
    unwrapType: new UnwrapTypeHelper(),
    unwrapVal: new UnwrapValHelper(),
    instanceof: new InstanceofHelper(),
    inObjectProperty: (options) => new InObjectPropertyHelper(options),
    inPropertyObjectProperty: new InPropertyObjectPropertyHelper(),
    inSymbolObjectProperty: new InSymbolObjectPropertyHelper(),
    createPropertyObject: new CreatePropertyObjectHelper(),
    findObjectProperty: (options) => new FindObjectPropertyHelper(options),
    findObjectPropertyBase: (options) => new FindObjectPropertyHelperBase(options),

    getArrayValue: new GetArrayValueHelper(),
    createArray: new CreateArrayHelper(),
    setArrayValue: new SetArrayValueHelper(),
    getArrayIndex: new GetArrayIndexHelper(),
    setArrayIndex: new SetArrayIndexHelper(),
    wrapArray: new WrapArrayHelper(),
    unwrapArray: new UnwrapArrayHelper(),
    isArray: new IsArrayHelper(),

    getMapValue: new GetMapValueHelper(),
    createMap: new CreateMapHelper(),
    setMapValue: new SetMapValueHelper(),
    wrapMap: new WrapMapHelper(),
    unwrapMap: new UnwrapMapHelper(),

    createBuffer: new CreateBufferHelper(),
    getBufferValue: new GetBufferValueHelper(),
    setBufferValue: new SetBufferValueHelper(),
    unwrapBuffer: new UnwrapBufferHelper(),
    wrapBuffer: new WrapBufferHelper(),

    export: (options) => new ExportHelper(options),
    exportSingle: (options) => new ExportSingleHelper(options),
    getModule: (options) => new GetModuleHelper(options),
    getCurrentModule: new GetCurrentModuleHelper(),
    getModules: new GetModulesHelper(),
    addEmptyModule: new AddEmptyModuleHelper(),

    isBlockchainInterface: (options) => new IsBlockchainInterfaceHelper(options),
    wrapBlockchainInterface: (options) => new WrapBlockchainInterfaceHelper(options),
    unwrapBlockchainInterface: new UnwrapBlockchainInterfaceHelper(),

    addArguments: new AddArgumentsHelper(),
    addArrayObject: new AddArrayObjectHelper(),
    addBooleanObject: new AddBooleanObjectHelper(),
    addBufferObject: new AddBufferObjectHelper(),
    addErrorObject: new AddErrorObjectHelper(),
    addMapObject: new AddMapObjectHelper(),
    addModules: new AddModulesHelper(),
    addNumberObject: new AddNumberObjectHelper(),
    addObjectObject: new AddObjectObjectHelper(),
    addStringObject: new AddStringObjectHelper(),
    addSymbolObject: new AddSymbolObjectHelper(),
    setGlobalObject: new SetGlobalObjectHelper(),
    getArgument: (options) => new GetArgumentHelper(options),
    getGlobalProperty: (options) => new GetGlobalPropertyHelper(options),
    globalProperties: GLOBAL_PROPERTIES,
  };
};
