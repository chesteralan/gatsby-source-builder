const axios = require('axios');

const pluginOptionsSchema = ({ Joi }) => {
    return Joi.object({
        apiKey: Joi.string().required().description(`Builder.io Api Key`),
        models: Joi.array().required(),
        limit: Joi.number().required().integer().max(200).positive(),
        sort: Joi.sting(),
        includeRefs: Joi.boolean(),
    })
}

const sourceNodes = async ({ actions, createContentDigest, createNodeId }, pluginOptions) => {

    const { apiKey, models, limit, includeRefs, sort } = pluginOptions;

    // fetch content
    const fetchModel = async (model, apiKey, limit) => {
            let builderUrl = 'https://cdn.builder.io/api/v2/content/';
            let fetching = true;
            let offset = 0;
            let results = [];
            const incRefs = includeRefs ? 'true' : 'false';
            const sortString = (sort==='' || !sort) ? 'sort.createdDate=-1' : sort;
            while(fetching) {
                let apiUrl = `${builderUrl}${model}?apiKey=${apiKey}&limit=${limit}&offset=${offset}&includeRefs=${incRefs}&${sortString}`;
                await axios.get(apiUrl)
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