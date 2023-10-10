class KeyNotFoundError extends Error {
    constructor(key) {
        super(`Key ${key} not found in storage`);
        this.key = key;
    }
}

class IllegalArgumentError extends Error {
    constructor(message) {
        super(message);
    }
}

export { KeyNotFoundError, IllegalArgumentError };