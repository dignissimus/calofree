export interface TextBreak {
    node: Node;
    start: number;
    end: number;
}

export enum RemovalOption {
    Censor,
    Cover,
    Delete,
    Disable
}
