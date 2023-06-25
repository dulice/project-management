const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLScalarType, GraphQLBoolean } = require("graphql");
const User = require("../model/userModel");
const Project = require("../model/projectModel");
const Task = require("../model/taskModel");

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        password: { type: GraphQLString},
        photo: { type: GraphQLString},
        position: { type: GraphQLString},
        updatedAt: { type: GraphQLString},
        publicId: {type: GraphQLString}
    })
})

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        title: {type: GraphQLString },
        description: {type: GraphQLString },
        languages: {type: new GraphQLList(GraphQLString) },
        image: {type: GraphQLString },
        publicId: { type: GraphQLString },
        status: {type: GraphQLString },
        members: {
            type: new GraphQLList(UserType),
            args: {id: {type: new GraphQLList(GraphQLID)}},
            resolve: (parent, args) => {
                return User.find( { _id: { $in: parent.membersId } } )
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            args: {id: {type: new GraphQLList(GraphQLID)}},
            resolve: (parent, args) => {
                return Task.find( { projectId: parent.id } ).sort({createdAt: -1})
            }
        }
    })
});

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString},
        isDone: { type: GraphQLBoolean},
        user: { 
            type: UserType,
            args: { id: { type: GraphQLID} },
            resolve: (parent, args) => {
                return User.findById(parent.userId)
            }
        },
        project: { 
            type: ProjectType,
            args: { id: { type: GraphQLID} },
            resolve: (parent, args) => {
                return Project.findById(parent.projectId)
            }
        },
    })
})

const UploadType = new GraphQLScalarType({
    name: "Upload",
    serialize: (file) => file,
    parseValue: (file) => file,
    parseLiteral(file) {
        return file;
    }
});

const DeleteImageType = new GraphQLObjectType({
    name: "DeleteImage",
    fields: () => ({
        publicId: { type: GraphQLString }
    })
})

module.exports = { UserType, ProjectType, TaskType, UploadType, DeleteImageType }