/**
 * This should load user data from the server once keycloak is 
 * initiated and provide it to the app as context for.
 */

import { createContext, useEffect, useState } from "react"
import { useKeycloak } from "../hooks/useKeycloak"
import { getCurrentUserApiV1UsersMeGet, UserResponse } from "../api"

interface MeContextType {
    user: UserResponse | undefined;
    loading: boolean;
}

const MeContext = createContext<MeContextType | undefined>(undefined)

const MeProvider = ({ children }: { children: React.ReactNode }) => {
    const { keycloak, authenticated } = useKeycloak()
    const [user, setUser] = useState<UserResponse | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (keycloak && authenticated) {
            getCurrentUserApiV1UsersMeGet(
                {
                    headers: {
                        Authorization: `Bearer ${keycloak.token}`,
                    },
                }
            ).then(({ data, response }) => {
                if (response.status !== 200) {
                    console.error("Failed to fetch user data", response)
                    setLoading(false)
                    return
                }
                if (!data) {
                    console.error("No user data found")
                    setLoading(false)
                    return
                }
                setUser(data)
                setLoading(false)
            }).catch((error) => {
                console.error("Error fetching user data", error)
                setLoading(false)
            }
            )
        }
        else {
            setUser(undefined)
            setLoading(false)
        }
    }, [keycloak, authenticated])

    return (
        <MeContext.Provider value={{ user, loading }}>
            {children}
        </MeContext.Provider>
    )
}

export { MeContext, MeProvider }


