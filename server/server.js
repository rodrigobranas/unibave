const { ApolloServer } = require("apollo-server");

const typeDefs = `

	type Item {
		id: Int
		category: String
		description: String
		price: Float
	}

	type Query {
		items: [Item]
	}

`;

const items = [
	{ id: 1, category: "Bebida", description: "Refrigerante", price: 10 },
	{ id: 2, category: "Bebida", description: "Suco", price: 7 },
	{ id: 3, category: "Bebida", description: "Água", price: 5 },
	{ id: 4, category: "Entrada", description: "Pastel de queijo", price: 15 }
];

const resolvers = {
	Query: {
		items() {
			return items;
		}
	}
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen();
