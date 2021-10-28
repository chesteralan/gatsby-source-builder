const axios = require('axios');

const pluginOptionsSchema = ({ Joi }) => {
    return Joi.object({
        apiKey: Joi.string()
            .required()
            .description(`Builder.io Api Key`),
        models: Joi.array()
            .required(),
        limit: Joi.number().required().integer().max(200).positive(),
    })
}

const sourceNodes = async (props, pluginOptions) => {

    const {
        actions,
        createContentDigest,
        createNodeId,
    } = props;

    // fetch content
    const fetchModel = async (model, apiKey, limit) => {
            let builderUrl = 'https://cdn.builder.io/api/v2/content/';
            let fetching = true;
            let offset = 0;
            let results = [];
            while(fetching) {
                await axios.get(`${builderUrl}${model}?apiKey=${apiKey}&limit=${limit}&offset=${offset}&sort.createdDate=-1`)
                .then(({ data }) => {
                    if( data.results.length > 0 ) {
                        results = results.concat(data.results);
                    }
                    if( data.results.length < limit ) {
                        fetching = false;
                    }
                });
                offset = offset + limit;
            }
            return results;
    }
    
    const { apiKey, models, limit } = pluginOptions;

    await Promise.all(models.map(async (model) => {
        const results = await fetchModel(model, apiKey, limit);
        results.map(async (item) => {
            await actions.createNode({
                // add all fields from pageData
                ...item,
                //required fields
                id: createNodeId(item.id),
                parent: null,
                children: [],
                internal: {
                    type: 'ProductPageData',
                    contentDigest: createContentDigest(item)
                }
            })
        })
    }))


};

module.exports = { pluginOptionsSchema, sourceNodes };