const applicationState = {
    plumbers: [],
    requests: [],
    completions: []
}
const API = "http://localhost:8088"

export const fetchRequests = () => {
    return fetch(`${API}/requests`)
        .then(response => response.json())
        .then(
            (serviceRequests) => {
                // Store the external state in application state
                applicationState.requests = serviceRequests
            }
        )
}

export const getRequests = () => {
    const requestMap = applicationState.requests.map(
        (requestObj) => {
            const foundComplete = applicationState.completions.find(
                (completionObj) => {

                    if (completionObj.requestId === requestObj.id) {
                        return true
                    }
                    return false
                }
            )
            const newRequestObj = { ...requestObj }
            //!ternary operator- a condition followed by a question mark (?), then an expression to execute if the condition is truthy followed by a colon (:), and finally the expression to execute if the condition is falsy.
            newRequestObj.completed = foundComplete ? true : false
            return newRequestObj
        }
    )
    requestMap.sort(
        (object1, object2) => {
            if (object2.completed === object1.completed) {
                return 0
            } else {
                if (object2.completed) {
                    return 1
                } else {
                    return -1
                }
            }
        }
    )
    return requestMap
}

export const fetchPlumbers = () => {
    return fetch(`${API}/plumbers`)
        .then(response => response.json())
        .then(
            (plumberList) => {
                // Store the external state in application state
                applicationState.plumbers = plumberList
            }
        )
}

export const getPlumbers = () => {
    return applicationState.plumbers.map(plumber => ({ ...plumber }))
}

const mainContainer = document.querySelector("#container")

export const sendRequest = (userServiceRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userServiceRequest)
    }


    return fetch(`${API}/requests`, fetchOptions)
        .then(response => response.json())
        .then(() => {
            mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
        })

}

export const deleteRequest = (id) => {
    return fetch(`${API}/requests/${id}`, { method: "DELETE" })
        .then(
            () => {
                mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
            }
        )
}

export const saveCompletion = (plumber) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(plumber)
    }


    return fetch(`${API}/completions`, fetchOptions)
        .then(response => response.json())
        .then(() => {
            mainContainer.dispatchEvent(new CustomEvent("stateChanged"))
        })

}

export const fetchCompletions = () => {
    return fetch(`${API}/completions`)
        .then(response => response.json())
        .then(
            (completedList) => {
                // Store the external state in application state
                applicationState.completions = completedList
            }
        )
}

export const getCompletions = () => {
    return applicationState.completions.map(complete => ({ ...complete }))
}





// const points = [40, 100, 1, 5, 25, 10];
// document.getElementById("demo1").innerHTML = points;  

// points.sort(function(a, b){return a - b});
// document.getElementById("demo2").innerHTML = points;