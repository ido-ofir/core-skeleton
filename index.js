
function typeOf(thing){ // return correct native type.
    var type = Object.prototype.toString.call(thing);
    return type.substring(8, type.length -1).toLowerCase();
}

function Core(options) {

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
    toolChains: {
        plugins: []
    },
    runToolChain(name, data, done){
        
        var index = 0;
        var toolChain = this.toolChains[name];
        if(!toolChain) { throw new Error(`cannot find toolChain '${name}'`); }
        
        function next(data){
            var tool = toolChain[index];
            if(!tool) return done(data);
            index++;
            tool(data, next);
        }

        next(data);

    },
    Plugin(definition, callback) {

        if (!definition || !this.isObject(definition)) { throw new Error(`cannot create plugin from "${definition}"`); }
        if (!definition.name) { throw new Error(`a plugin's name is missing in Object ${ Object.keys(definition) }`); }

        
        this.runToolChain('plugins', definition, (plugin)=>{
            if(this.isFunction(plugin.init)){
                plugin.init(this);
            }
            if(this.isFunction(callback)){
                callback(plugin);
            }
        });
        
    }
}

module.exports = Core;