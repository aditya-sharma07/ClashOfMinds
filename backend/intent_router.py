def route_prompt(intent, user_input):
    # Later you can classify intents dynamically
    if intent == "resume":
        return f"Help improve this resume/LinkedIn summary in a clear, natural tone:\n\n{user_input}"
    elif intent == "career":
        return f"Give career guidance:\n\n{user_input}"
    elif intent == "code":
        return f"Explain this code/problem clearly:\n\n{user_input}"
    elif intent == "emotional":
        return f"Be supportive. The user says:\n\n{user_input}"
    elif intent == "history":
        return f"Explain this historical topic like a good teacher:\n\n{user_input}"
    else:
        return user_input
