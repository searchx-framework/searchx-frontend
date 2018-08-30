const requiredEnv = [
    'REACT_APP_PUBLIC_URL',
    'REACT_APP_SERVER_URL'
];

export function checkRequiredEnv() {
    const unsetEnv = requiredEnv.filter((env) => !(env in process.env));
    if (unsetEnv.length > 0) {
        throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]");
    }
}