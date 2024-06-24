const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
} = require("graphql");
const {
  UserType,
  ProjectType,
  TaskType,
  UploadType,
  DeleteImageType,
} = require("./objectType");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Project = require("../model/projectModel");
const Task = require("../model/taskModel");
const { cloudinary } = require("../config");

const rootQuery = new GraphQLObjectType({
  name: "rootQuery",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return User.find().sort({ createdAt: -1 });
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return User.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: () => {
        return Project.find().sort({ createdAt: -1 });
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Project.findById(args.id);
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => {
        return Task.find().sort({ createdAt: -1 });
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Task.findById(args.id);
      },
    }
  }),
});

const rootMutation = new GraphQLObjectType({
  name: "rootMutation",
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        photo: { type: UploadType },
        position: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(args.password, salt);
        if(args.photo) {
          const { createReadStream } = await args.photo.file;
          const uploadResult = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream({ folder: 'project-management/user' }, (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              });
              createReadStream().pipe(stream);
            });
            const user = new User({
              name: args.name,
              email: args.email,
              password,
              position: args.position,
              photo: uploadResult.secure_url,
              publicId: uploadResult.public_id
            });
            return user.save();
        } else {
          const user = new User({
            name: args.name,
            email: args.email,
            password,
            position: args.position,
          });
          return user.save();
        }
        
      },
    },
    signInUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID},
        password: {type: GraphQLString}
      },
      resolve: async (parent, args) => {
        try {
          const userExist = await User.findById(args.id);
          console.log(userExist)
          const comparePassword = bcrypt.compareSync(args.password, userExist.password);
          if(!userExist || !comparePassword) {
            throw Error("Wrong Credentails")
          } else {
            return userExist
          }
        } catch (error) {
          console.log(error);
        }
        }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        position: { type: GraphQLString },
        photo: { type: UploadType },
      },
      resolve: async (parent, args) => {
        if (args.password) {
          const salt = await bcrypt.genSalt(10);
          args.password = await bcrypt.hash(args.password, salt);
        }

        if(args.photo) {          
          const { createReadStream } = await args.photo.file
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'project-management/user' }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
            createReadStream().pipe(stream);
          });
          args.photo = uploadResult.secure_url;
          args.publicId = uploadResult.public_id;
        }

        return User.findByIdAndUpdate(
          args.id,
          { $set: { ...args }},
          { new: true }
        );
      },
    },
    deleteUser: {
      type: UserType,
      args: { 
        id: { type: GraphQLID },
        publicId: { type: GraphQLString }
       },
      resolve: async (parent, args) => {
        await Task.deleteMany({userId: args.id});
        await Project.updateMany({}, {$pull: {membersId: args.id}})
        return User.findByIdAndRemove(args.id);
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        languages: { type: new GraphQLList(GraphQLString) },
        image: { type: UploadType },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              inprogress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        membersId: { type: new GraphQLList(GraphQLID) },
      },
      resolve: async (parent, args) => {
        const { createReadStream } = await args.image.file;
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'project-management/project' }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
            createReadStream().pipe(stream);
          });

        const project = new Project({
          title: args.title,
          description: args.description,
          languages: args.languages,
          image: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          status: args.status,
          membersId: args.membersId,
        });
        return project.save();
      },
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        languages: { type: new GraphQLList(GraphQLString) },
        image: { type: UploadType },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectUpdateStatus",
            values: {
              new: { value: "Not Started" },
              inprogress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
        membersId: { type: new GraphQLList(GraphQLID) },
      },
      resolve: async (parent, args) => {
        if(args.image) {
          const { createReadStream } = await args.image.file;
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({folder: 'project-management/project'}, (error, result) => {
              if(error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
            createReadStream().pipe(stream)
          });
          args.image = uploadResult.secure_url;
          args.publicId = uploadResult.public_id;
        }
        const project = Project.findByIdAndUpdate(
          args.id,
          {
            $set: { ...args },
          },
          { new: true }
        );
        return project;
      },
    },
    deleteProject: {
      type: ProjectType,
      args: { 
        id: { type: GraphQLID },
       },
      resolve: async (parent, args) => {
        Task.deleteMany({projectId: args.id})
        return Project.findByIdAndRemove(args.id);
      },
    },
    addTask: {
      type: TaskType,
      args: {
        name: { type: GraphQLString },
        isDone: { type: GraphQLBoolean },
        userId: { type: GraphQLID },
        projectId: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        const task = new Task(args);
        return task.save();
      },
    },
    updateTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        isDone: { type: GraphQLBoolean },
        userId: { type: GraphQLID },
        projectId: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        const task = Task.findByIdAndUpdate(
          args.id,
          { $set: { ...args } },
          { new: true }
        );
        return task;
      },
    },
    deleteTask: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Task.findByIdAndRemove(args.id);
      },
    },
    deleteImage: {
      type: DeleteImageType,
      args: { publicId: { type: GraphQLString }},
      resolve: async (parent, args) => {
        const result = await cloudinary.uploader.destroy(args.publicId);
        return result
      }
    }
  }),
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});

module.exports = schema;
