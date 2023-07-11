import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 实现全局的 actions
 *
 * 1. 订阅函数
 * 2. 在其他页面执行函数
 * 3. 不需要用户手动消除订阅，会根据组件自动销毁而销毁
 */

interface Actions {
  [type: string]: Set<Function>;
}

type ActionsUpdateCallback = (actions: Actions) => void;

type ActionCallback = (...params: any[]) => Promise<any[]>

type DataType = 'Object' | 'Array' | 'Set'

function create() {
  // 当前所有的 actions
  let actions: Actions = {};
  // 当 actions 变动后，会触发 updateActions
  const updateActions: Record<number, ActionsUpdateCallback> = {};
  // 每个 action 都会分配唯一的 key
  let serialNumber = 0;

  function numberHandle() {
    const lastNumber = serialNumber;
    serialNumber += 1;
    return lastNumber;
  }

  function useSubscribe() {
    // 保存当前组件的所有订阅
    const currentAddCallbackRef = useRef(new Set<Function>());

    useEffect(() => {
      return () => {
        // 组件销毁时，删除当前组件的所有订阅
        Object.values(actions).forEach((callbacks) => {
          const sets = currentAddCallbackRef.current;
          sets.forEach((key) => {
            if (callbacks.has(key)) {
              callbacks.delete(key);
            }
          });
        });
        currentAddCallbackRef.current = new Set<Function>();
      };
    }, []);

    return useCallback(
      (type: string, callback: Function) => {
        // 当原本订阅不存在时，创建一个新的 Set
        if (!actions[type]) {
          actions[type] = new Set<Function>();
        }
        actions[type].add(callback);
        currentAddCallbackRef.current.add(callback);
        actions = { ...actions };
        // 触发更新
        Object.values(updateActions).forEach((action) => {
          action(actions);
        });
      },
      []
    );
  }

  function useAction(funCallback: (actions: Actions) => Set<Function>): ActionCallback;
  function useAction(funCallback: (actions: Actions) => Set<Function>[]): ActionCallback[];
  function useAction(funCallback: (actions: Actions) => Record<string, Set<Function>>): Record<string, ActionCallback>;
  function useAction(funCallback: (actions: Actions) => any): any {
    const [typeActions, setTypeActions] = useState(funCallback(actions));
    // 返回值类型
    const returnType = useMemo(() => typeofData(typeActions), [typeActions]);
    // 得到每一种类型的默认值
    const initValRef = useRef<any>(getInitTypeVal(returnType));
    // 每个 action 都会分配唯一的 key
    const currentN = useRef(numberHandle());

    useEffect(() => {
      initValRef.current = getInitTypeVal(returnType);
    }, [funCallback, returnType]);

    useEffect(() => {
      const uniqueKey = currentN.current;
      updateActions[uniqueKey] = (newActions) => {
        let newTypeActions;
        if (returnType === 'Object') {
          newTypeActions = Object.assign(
            initValRef.current,
            funCallback(newActions)
          );
        } else if (returnType === 'Array') {
          initValRef.current.push(...funCallback(newActions));
          newTypeActions = initValRef.current;
        } else {
          newTypeActions = funCallback(newActions);
        }
        if (newTypeActions !== typeActions) {
          setTypeActions(newTypeActions);
        }
      };
      return () => {
        initValRef.current = getInitTypeVal(returnType);
        delete updateActions[uniqueKey];
      };
    }, [returnType, funCallback, typeActions]);

    return useMemo<any>(() => {
      switch (returnType) {
        case 'Set':
          return trigger.bind(null, typeActions);
        case 'Object': {
          const obj: Record<string, Function> = {};
          Object.entries(typeActions).forEach(([key, tempTypeActions]) => {
            obj[key] = trigger.bind(null, tempTypeActions);
          });
          return obj;
        }
        case 'Array':
          return typeActions.map((tempTypeActions: any) =>
            trigger.bind(null, tempTypeActions)
          );
        default:
          return () => {}
      }
    }, [returnType, typeActions]);
  }

  return { useSubscribe, useAction };
}

async function trigger(action: Set<Function>, ...params: any[]) {
  return Promise.all(getAllTask(action, ...params));
}

function getAllTask(typeTasks: Set<Function>, ...params: any[]) {
  const tasks: Promise<any>[] = [];
  typeTasks.forEach((callback) => {
    tasks.push(callback(...params));
  });
  return tasks;
}

function typeofData(data: Set<Function>): DataType;
function typeofData(data: Set<Function>[]): DataType;
function typeofData(data: Record<string, Set<Function>>): DataType;
function typeofData(data: any): DataType {
  let type = Object.prototype.toString.call(data);
  // 去掉两边的 []
  type = type.slice(1, type.length - 1);
  // 按空格分割字符串
  return type.split(' ')[1] as DataType;
}


function getInitTypeVal(type: DataType) {
  const obj: {
    Object: Record<string, Set<Function>>;
    Array: Set<Function>[];
    Set: Set<Function>;
  } = {
    Object: {},
    Array: [],
    Set: new Set<Function>()
  };

  return obj[type];
}

export {create};
