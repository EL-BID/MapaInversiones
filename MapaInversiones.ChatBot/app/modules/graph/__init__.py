# Glossary
# https://langchain-ai.github.io/langgraph/concepts/high_level/
# https://langchain-ai.github.io/langgraph/concepts/low_level/

# At its core, LangGraph models agent workflows as graphs. You define the behavior of your agents using three key components:

# -  State: A shared data structure that represents the current snapshot of your application. It can be any Python type, but is typically a TypedDict or Pydantic BaseModel.
# -  Nodes: Python functions that encode the logic of your agents. They receive the current State as input, perform some computation or side-effect, and return an updated State.
# -  Edges: Python functions that determine which Node to execute next based on the current State. They can be conditional branches or fixed transitions.

# By composing Nodes and Edges, you can create complex, looping workflows that evolve the State over time. The real power, though, comes from how LangGraph manages that State.

# To emphasize: Nodes and Edges are nothing more than Python functions - they can contain an LLM or just good ol' Python code.

# In short: nodes do the work. edges tell what to do next.

# LangGraph's underlying graph algorithm uses message passing to define a general program. When a Node completes its operation, it sends messages along one or more edges to other node(s). These recipient nodes then execute their functions, pass the resulting messages to the next set of nodes, and the process continues.
