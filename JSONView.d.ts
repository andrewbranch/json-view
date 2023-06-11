export default class JSONView {
    constructor(name: string, value: any);
    dom: HTMLElement;
    name: string;
    value: any;
    readonly type: string;
    refresh(): void;
    collapse(): void;
    expand(): void;
    destroy(): void;
}
