import { gql } from "@apollo/client";
const TASKS = gql`
    query tasks {
        tasks {
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

const TASK = gql`
    query task($id: ID!) {
        tasks(id: $id) {
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

export { TASKS, TASK };
