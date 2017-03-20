
function typeOf(thing){ // return correct native type.
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
}

function Core(options) {

    this.name = options.name;
    this.plugins = {};
    this.constructor = Core;
    this.core = this;

}

Core.prototype = {
    typeOf: typeOf,
    isUndefined(v){ return typeOf(v) === 'undefined'; },
    isNull(v){ return typeOf(v) === 'null'; },
    isBoolean(v){ return typeOf(v) === 'boolean'; },
    isNumber(v){ return typeOf(v) === 'number'; },
    isString(v){ return typeOf(v) === 'string'; },
    isArray(v){ return typeOf(v) === 'array'; },
    isObject(v){ return typeOf(v) === 'object'; },
    isFunction(v){ return typeOf(v) === 'function'; },
    emptyObject: {},
    emptyArray: [],
    emptyFunction(){},
    call(func, ...args){
        if(!this.isFunction(func)){ return func; }
        return func.call(this, ...args);
    },
    builders: {
        plugin: []
    },
    make(name, data, done){
        
        var core = this;
        var index = 0;
        var builder = this.buildres[name];
        if(!builder) { throw new Error(`cannot find builder '${name}'`); }
        
        function next(data){
            var tool = builder[index];
            if(!tool) return (done && done(data));
            index++;
            core.call(tool, data, next);
        }

        next(data);

    },
    Plugin(definition, callback) {

        if (!definition || !this.isObject(definition)) { throw new Error(`cannot create plugin from "${definition}"`); }
        if (!definition.name) { throw new Error(`a plugin's name is missing in Object ${ Object.keys(definition) }`); }

        this.make('plugin', definition, (plugin)=>{
            if(this.isFunction(plugin.init)){
                plugin.init(this)
            }
            this.plugins[plugin.name] = plugin;
            if(this.isFunction(callback)){
                callback(plugin);
            }
        });
        
    }
}

module.exports = Core;