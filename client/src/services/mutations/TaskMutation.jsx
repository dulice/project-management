import { gql } from "@apollo/client"
const ADD_TASK = gql`
    mutation AddTask($name: String!, $userId: ID!, $projectId: ID!) {
        addTask(name: $name, userId: $userId, projectId: $projectId) {
            id
            name
            isDone
            user {
                id
                name
                photo
            }
            project {
                id
                title
                image
            }
        }
    }
`

const UPDATE_TASK = gql`
    mutation updateTask($id: ID, $name: String, $isDone: Boolean, $userId: ID, $projectId: ID) {
        updateTask(id: $id, name: $name, isDone: $isDone, userId: $userId, projectId: $projectId) {
            id
            name
            isDone
            user {
                id
                name
                photo
            }
            project {
                id
                title
                image
            }
        }
    }
`

const DELETE_TASK = gql`
    mutation deleteTask($id: ID) {
        deleteTask(id: $id) {
            id
        }
    }
`
export { ADD_TASK, UPDATE_TASK, DELETE_TASK }