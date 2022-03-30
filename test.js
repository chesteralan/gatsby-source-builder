// noop

const gatsbyNode = require('./gatsby-node');
require("dotenv").config();

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
    apiKey: process.env.BUILDER_API_KEY, 
    models: ['page','funnel-section', 'multipage-funnel'], 
    limit: 100,
    includeRefs: true,
    sort: ''
});
