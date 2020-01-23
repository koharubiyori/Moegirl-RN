export type ActionTypeToHandlerMaps<ActionTypes, State> = {
  [ActionType in keyof ActionTypes]: (actionData: ActionTypes[ActionType]) => State
}

export default function setActionHandler<ActionTypes, State>(
  actionData: __Redux.ReduxAction<keyof ActionTypes>, 
  actionTypeToHandlerMaps: ActionTypeToHandlerMaps<ActionTypes, State>
) {
  const handler = actionTypeToHandlerMaps[actionData.type]
  return handler ? handler(actionData as any) : null
}