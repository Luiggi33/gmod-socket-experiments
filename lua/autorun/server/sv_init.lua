require("gwsockets")

local socket = GWSockets.createWebSocket("ws://localhost:8080", false)

function socket:onMessage(txt)
    local data = util.JSONToTable(txt)
    PrintTable(data)
    if (data.isInstructions) then
        local func = CompileString(data.instructions, "test")
        local args = data.args
        local succ, err = pcall(func, args)
        if (not succ) then
            print("Error running instructions: ", err)
        end
    else
        print("Message: ", txt)
    end
    socket:close()
end

function socket:onError(txt)
    print("Error: ", txt)
end

function socket:onConnected()
    print("Connected to server")

    socket:write(util.TableToJSON({
        "test",
        "test2"
    }))
end

function socket:onDisconnected()
    print("WebSocket disconnected")
end

socket:open()