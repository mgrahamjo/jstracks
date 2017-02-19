export default (key, functions) => {
    
    return functions[key] ? functions[key]() : undefined;
    
};
