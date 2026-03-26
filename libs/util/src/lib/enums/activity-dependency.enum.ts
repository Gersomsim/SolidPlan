export const ActivityDependencyType = {
    FINISH_TO_START: 'FS', //La más común. No puedes empezar la siguiente hasta que la anterior termine.
    START_TO_START: 'SS', //Ambas inician al mismo tiempo.
    FINISH_TO_FINISH: 'FF', //Ambas terminan al mismo tiempo.
    START_TO_FINISH: 'SF', //No puedes terminar la siguiente hasta que la anterior empiece.
} as const;