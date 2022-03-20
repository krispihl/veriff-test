export type Check = {
    id: string,
    priority: number,
    description: string,
    active?: boolean,
    disabled?: boolean,
    value?: string,
}

export type CheckUpdate = {
    check: Check,
    updateChecks: (value: string, id: string) => void,
}
