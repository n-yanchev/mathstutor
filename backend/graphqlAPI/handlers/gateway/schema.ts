export const supergraphSdl = `
schema
  @core(feature: "https://specs.apollo.dev/core/v0.1"),
  @core(feature: "https://specs.apollo.dev/join/v0.1")
{
  query: Query
  mutation: Mutation
}

directive @core(feature: String!) repeatable on SCHEMA

directive @join__field(graph: join__Graph, requires: join__FieldSet, provides: join__FieldSet) on FIELD_DEFINITION

directive @join__type(graph: join__Graph!, key: join__FieldSet) repeatable on OBJECT | INTERFACE

directive @join__owner(graph: join__Graph!) on OBJECT | INTERFACE

directive @join__graph(name: String!, url: String!) on ENUM_VALUE

type Appointment
  @join__owner(graph: APPOINTMENT)
  @join__type(graph: APPOINTMENT, key: "id")
  @join__type(graph: COURSE, key: "id")
{
  course: Course! @join__field(graph: COURSE)
  id: ID! @join__field(graph: APPOINTMENT)
  startTimeStamp: String! @join__field(graph: APPOINTMENT)
  weekDays: [WeekDay!]! @join__field(graph: APPOINTMENT)
}

type Course
  @join__owner(graph: COURSE)
  @join__type(graph: COURSE, key: "lessonIDList")
  @join__type(graph: LESSON, key: "lessonIDList")
{
  lessonIDList: [String!]! @join__field(graph: COURSE)
  lessons: [Lesson!]! @join__field(graph: LESSON)
  title: String! @join__field(graph: COURSE)
}

scalar join__FieldSet

enum join__Graph {
  APPOINTMENT @join__graph(name: "appointment" url: "https://api.mathstutor.ru/appointment")
  COURSE @join__graph(name: "course" url: "https://api.mathstutor.ru/course")
  LESSON @join__graph(name: "lesson" url: "https://api.mathstutor.ru/lesson")
  PROFILE @join__graph(name: "profile" url: "https://api.mathstutor.ru/profile")
}

type Lesson {
  title: String!
}

type Mutation {
  signUp(email: String!, name: String!, password: String!): ProfileResult! @join__field(graph: PROFILE)
  updateProfile(name: String!): ProfileResult! @join__field(graph: PROFILE)
}

type Profile
  @join__owner(graph: PROFILE)
  @join__type(graph: PROFILE, key: "id")
  @join__type(graph: APPOINTMENT, key: "id")
{
  appointment: Appointment @join__field(graph: APPOINTMENT)
  email: String! @join__field(graph: PROFILE)
  id: ID! @join__field(graph: PROFILE)
  name: String! @join__field(graph: PROFILE)
}

enum ProfileError {
  email_already_exists
}

type ProfileResult {
  error: ProfileError
  ok: Boolean!
}

type Query {
  profile: Profile! @join__field(graph: PROFILE)
}

type WeekDay {
  duration: Int
  hour: Int!
  minute: Int!
  number: Int!
}
`