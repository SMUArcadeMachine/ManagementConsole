function coerceId(id) {
    return id == null ? null : id+'';
}
var forEach = Ember.ArrayPolyfills.forEach;
var map = Ember.ArrayPolyfills.map;
App.ApplicationSerializer = DS.RESTSerializer.extend({
    extractSingle: function(store, primaryType, payload, recordId, requestType) {
        log.debug('DS.ApplicationSerializer.extractSingle');
        payload = this.normalizePayload(primaryType, payload);

        var primaryTypeName = primaryType.typeKey,
            primaryRecord;

        for (var prop in payload) {
            var typeName  = this.typeForRoot(prop),
                isPrimary = typeName === primaryTypeName;
            if (isPrimary && Ember.typeOf(payload[prop]) !== "array" ) {
                primaryRecord = this.normalize(primaryType, payload[prop], prop);
                continue;
            }
            forEach.call(payload[prop], function(hash) {
                var typeName = this.typeForRoot(prop),
                    type = store.modelFor(typeName),
                    typeSerializer = store.serializerFor(type);

                hash = typeSerializer.normalize(type, hash, prop);

                var isFirstCreatedRecord = isPrimary && !recordId && !primaryRecord,
                    isUpdatedRecord = isPrimary && coerceId(hash.id) === recordId;
                if (isFirstCreatedRecord || isUpdatedRecord) {
                    primaryRecord = hash;
                } else {
                    store.push(typeName, hash,true);
                }
            }, this);
        }

        return primaryRecord;
    },
    extractArray: function(store, primaryType, payload) {
        log.debug('DS.ApplicationSerializer.extractArray');
        payload = this.normalizePayload(primaryType, payload);

        var primaryTypeName = primaryType.typeKey,
            primaryArray;

        for (var prop in payload) {
            var typeKey = prop,
                forcedSecondary = false;

            if (prop.charAt(0) === '_') {
                forcedSecondary = true;
                typeKey = prop.substr(1);
            }

            var typeName = this.typeForRoot(typeKey),
                type = store.modelFor(typeName),
                typeSerializer = store.serializerFor(type),
                isPrimary = (!forcedSecondary && (typeName === primaryTypeName));

            var normalizedArray = map.call(payload[prop], function(hash) {
                return typeSerializer.normalize(type, hash, prop);
            }, this);

            if (isPrimary) {
                primaryArray = normalizedArray;
            } else {
                store.pushMany(typeName, normalizedArray,true);
            }
        }

        return primaryArray;
    },
    applyTransforms: function(type, data) {
        log.debug('DS.ApplicationSerializer.applyTransforms');
        type.eachTransformedAttribute(function(key, type) {
            var transform = this.transformFor(type);
            if(data[key] == null) return;//Used for partial records - don't add extra key/values that are part of a full record
            data[key] = transform.deserialize(data[key]);
        }, this);

        return data;
    }
});
