import axios, { AxiosInstance, AxiosResponse } from "axios"
import { GroupModel } from "../interface-contract/group-model"
import { IUserWrapper } from "../interface-contract/user/user-wrapper"
import { JwtModel } from "../interface-contract/jwt-model"
import { IUser } from "../interface-contract/user/user-model"
import { GroupUserModel } from "../interface-contract/group-user-model"
import { setAlerts, store } from "../reducers"

export class HttpService {

  private instance: AxiosInstance

  constructor() {
    // const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:9090/api" : "http://production-url.com/api"
    const baseURL = process.env.NODE_ENV === "development" ? "http://18.229.255.151:9090/api" : "http://18.229.255.151:9090/api"
    
    this.instance = axios.create({
      withCredentials: true,
      baseURL
    })
    this.instance.interceptors.response.use((response) => {
      return response
    }, (error) => {
      if (error.message === "Network Error") {
        store.dispatch(setAlerts({
          alert: {
            text: "No se puede acceder al servidor. Por favor, inténtalo de nuevo más tarde.",
            alert: "error",
            isOpen: true
          }
        }))
      }
      return Promise.reject(error)
    })
  }

  authenticate(jwtModel: JwtModel): Promise<AxiosResponse<IUser>> {
    return this.instance.post("auth", jwtModel)
  }

  public async pingRoute(): Promise<AxiosResponse<IUserWrapper>> {
    return this.instance.get("fetch")
  }

  public async ensureRoomExists(roomId: string): Promise<AxiosResponse<boolean>> {
    // return await axios.get(`http://localhost:9090/room/ensure-room-exists/${roomId}`, { withCredentials: true })
    return await axios.get(`http://18.229.255.151:9090/room/ensure-room-exists/${roomId}`, { withCredentials: true })
  }

  public logout(): Promise<AxiosResponse> {
    return this.instance.get("logout")
  }

  public createGroup(groupName: string): Promise<AxiosResponse<GroupModel>> {
    return this.instance.post("create", { name: groupName })
  }

  public addUserToGroup(userId: number | string, groupUrl: string): Promise<AxiosResponse> {
    return this.instance.get("user/add/" + userId + "/" + groupUrl)
  }

  public fetchAllUsersInConversation(groupUrl: string): Promise<AxiosResponse<GroupUserModel[]>> {
    return this.instance.get("users/group/" + groupUrl, {})
  }

  public fetchAllUsersWithoutAlreadyInGroup(groupUrl: string): Promise<AxiosResponse<GroupUserModel[]>> {
    return this.instance.get("users/all/" + groupUrl, {})
  }

  createUser(firstname: string, lastname: string, email: string, password: string): Promise<AxiosResponse> {
    return this.instance.post("user/register", {
	    firstname,
      lastname,
      email,
      password
    })
  }

  public leaveConversation(userIdToRemove: number, groupId: string): Promise<AxiosResponse> {
    return this.instance.get("user/leave/" + userIdToRemove + "/group/" + groupId)
  }

  public removeUserFromConversation(userIdToRemove: string | number, groupUrl: string): Promise<AxiosResponse> {
    return this.instance.get("user/remove/" + userIdToRemove + "/group/" + groupUrl)
  }

  public removeAdminUserInConversation(userIdToRemove: string | number, groupUrl: string): Promise<AxiosResponse> {
    return this.instance.get("user/remove/admin/" + userIdToRemove + "/group/" + groupUrl)
  }

  public grantUserAdminInConversation(userIdToGrant: number | string, groupId: string): Promise<AxiosResponse> {
    return this.instance.get("user/grant/" + userIdToGrant + "/group/" + groupId)
  }

  public uploadFile(data: FormData): Promise<AxiosResponse> {
    return this.instance.post("upload", data)
  }
}
