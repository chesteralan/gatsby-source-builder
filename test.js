// noop

const gatsbyNode = require('./gatsby-node');

gatsbyNode.sourceNodes({
    actions: {
        createNode: (node) => {
            console.log("createNode",node);
            return {};
        }
    },
    createContentDigest: (data) => {
        console.log("createContentDigest",data);
        return {};
    },
    createNodeId: (id) => {
        console.log("createNodeId",id);
        return id;
    },
}, {
    apiKey: "08d8ed1927034a9791a787768e108aa6", 
    models: ['product-page'], 
    limit: 2
});
