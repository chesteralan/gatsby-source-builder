// noop

const gatsbyNode = require('./gatsby-node');

gatsbyNode.sourceNodes({
    actions: {
        createNode: (node) => {
            //console.log("createNode",node);
            return {};
        }
    },
    createContentDigest: (data) => {
        //console.log("createContentDigest",data);
        return {};
    },
    createNodeId: (id) => {
        //console.log("createNodeId",id);
        return id;
    },
}, {
    apiKey: "enter-api-key-in-here", 
    models: ['product-page','search-data'], 
    limit: 100,
    includeRefs: true,
    sort: ''
});
