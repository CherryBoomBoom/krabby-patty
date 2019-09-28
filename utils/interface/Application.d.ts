export default class Application {
    protected app: {
        module: any;
        router: {
            [key: string]: {
                method: 'POST' | 'GET';
                callback: Function;
                functionName: string;
            };
        };
        baseUrl: string;
        s: {
            [key: string]: any;
        };
        c: {
            [key: string]: any;
        };
    };
    protected s: {
        [key: string]: any;
    };
    protected c: {
        [key: string]: any;
    };
    constructor(app: any);
}
