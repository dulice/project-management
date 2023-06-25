import { gql } from "@apollo/client"

const ADD_PROJECT = gql`
    mutation addProject( $title: String, $description: String, $languages: [String], $status: ProjectStatus, $membersId: [ID], $image: Upload) {
        addProject(title: $title, description: $description, languages: $languages, status: $status, image: $image, membersId: $membersId) {
            id
            title
            languages
            description
            image
            status
            members {
                id
                name
                photo
            }
        }
    }
`

const UPDATE_PROJECT = gql`
mutation updateProject($id: ID, $title: String, $description: String, $languages: [String], $status: ProjectUpdateStatus, $membersId: [ID], $image: Upload) {
    updateProject(id: $id,title: $title, description: $description, languages: $languages, status: $status, image: $image, membersId: $membersId) {
        id
        title
        languages
        description
        image
        status
        members {
            id
            name
            photo
        }
    }
}
`

const DELETE_PROJECT = gql`
    mutation deleteProject($id: ID) {
        deleteProject(id: $id) {
            id
        }
    }
`
export { ADD_PROJECT, UPDATE_PROJECT, DELETE_PROJECT }