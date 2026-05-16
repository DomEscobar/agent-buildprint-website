# TRACEABILITY MATRIX

| Buildprint Requirement | Source Evidence |
|---|---|
| Typed state schema | OBSERVED(`libs/langgraph/langgraph/graph/state.py:146-152`, `libs/langgraph/langgraph/graph/state.py:260-269`) |
| Partial updates | OBSERVED(`libs/langgraph/langgraph/graph/state.py:130-137`, `libs/langgraph/langgraph/graph/state.py:1443-1479`) |
| Reducers/channels | OBSERVED(`libs/langgraph/langgraph/channels/base.py:19-99`, `libs/langgraph/langgraph/channels/binop.py:51-109`) |
| Node registry | OBSERVED(`libs/langgraph/langgraph/graph/state.py:251-258`, `libs/langgraph/langgraph/graph/state.py:662-907`) |
| Directed edges | OBSERVED(libs/langgraph/langgraph/graph/state.py:915-967) |
| Conditional routing | OBSERVED(libs/langgraph/langgraph/graph/state.py:969-1017) |
| Compile validation | OBSERVED(`libs/langgraph/langgraph/graph/state.py:1116-1162`, `libs/langgraph/langgraph/graph/state.py:1247-1254`) |
| Compiled runtime | OBSERVED(`libs/langgraph/langgraph/graph/state.py:1164-1219`, `libs/langgraph/langgraph/graph/state.py:1333-1388`, `libs/langgraph/langgraph/graph/state.py:1391-1408`) |
| Superstep model | OBSERVED(libs/langgraph/langgraph/pregel/main.py:448-475) |
| Invoke/stream | OBSERVED(`libs/langgraph/langgraph/pregel/protocol.py:107-231`, `libs/langgraph/langgraph/pregel/main.py:2587-2695`, `libs/langgraph/langgraph/pregel/main.py:3750-3849`) |
| Durability modes | OBSERVED(libs/langgraph/langgraph/types.py:87-93) |
| Stream modes | OBSERVED(libs/langgraph/langgraph/types.py:120-134) |
| Checkpoint shape | OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:92-123) |
| Checkpoint tuple | OBSERVED(libs/checkpoint/langgraph/checkpoint/base/__init__.py:139-147) |
| Saver methods | OBSERVED(`libs/checkpoint/langgraph/checkpoint/base/__init__.py:227-318`, `libs/checkpoint/langgraph/checkpoint/base/__init__.py:417-509`) |
| In-memory saver | OBSERVED(`libs/checkpoint/langgraph/checkpoint/memory/__init__.py:33-48`, `libs/checkpoint/langgraph/checkpoint/memory/__init__.py:236-317`, `libs/checkpoint/langgraph/checkpoint/memory/__init__.py:427-510`) |
| Pending writes | OBSERVED(`libs/langgraph/langgraph/pregel/_loop.py:448-490`, `libs/langgraph/langgraph/pregel/_loop.py:715-729`) |
| Thread/checkpoint identity | OBSERVED(`libs/checkpoint/langgraph/checkpoint/memory/__init__.py:250-316`, `libs/checkpoint/langgraph/checkpoint/memory/__init__.py:449-470`) |
| Serializer safety | OBSERVED(`libs/checkpoint/langgraph/checkpoint/serde/jsonplus.py:82-95`, `libs/checkpoint/langgraph/checkpoint/serde/jsonplus.py:566-629`) |
| Interrupt/resume | OBSERVED(libs/langgraph/langgraph/types.py:801-924) |
| Command | OBSERVED(libs/langgraph/langgraph/types.py:748-798) |
| Send | OBSERVED(libs/langgraph/langgraph/types.py:654-743) |
| State snapshot/tasks | OBSERVED(libs/langgraph/langgraph/types.py:587-651) |
| Optional ToolNode/ReAct | OBSERVED(`libs/prebuilt/langgraph/prebuilt/tool_node.py:622-700`, `libs/prebuilt/langgraph/prebuilt/chat_agent_executor.py:274-318`) |
