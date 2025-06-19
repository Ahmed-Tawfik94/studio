
const courseData={
    "course_name": "AI-Powered Programming for Young Innovators",
    "age_group": "10-15 years old",
    "learning_goals": [
        "Understand what AI is and how it's used in real-world applications.",
        "Learn to use AI tools like Large Language Models (LLMs) to make their programs smarter.",
        "Get hands-on experience integrating AI APIs from platforms like OpenAI and Hugging Face into their Python projects.",
        "Develop critical thinking about how AI works and how to use it responsibly and safely.",
        "Build awesome AI-powered projects that they can show off to friends and family!",
        "Design, develop, and deploy applications that integrate AI technologies.",
        "Implement AI-based features using both proprietary and open-source tools.",
        "Create a fully functional, AI-enhanced software solution that demonstrates end-to-end development workflow incorporating AI at key stages."
    ],
    "modules": [
        {
            "module_id": 1,
            "module_title": "What in the World is AI? (And Why Should I Care?)",
            "aim": "Introduce the core concepts of Artificial Intelligence and Large Language Models in a simple, exciting way.",
            "description": "Have you ever wondered how your smart speaker answers questions, or how Netflix knows what movies you'll love? That's AI at work! In this module, we'll explore what AI really is, how it 'thinks' (sort of!), and how amazing AI systems called Large Language Models (LLMs) can understand and generate human-like text.",
            "what_students_will_build": "Play with a simple online chatbot to experience AI interaction firsthand.",
            "concepts_learned": [
                "What AI is",
                "examples of AI in daily life",
                "the idea of Large Language Models (LLMs)",
                "prompts (input to the model)",
                "completions (output from the model)"
            ],
            "lessons": [
                {
                    "lesson_id": 1.1,
                    "lesson_title": "Meet AI! Your Digital Super-Helper",
                    "aim": "To understand what Artificial Intelligence is and see examples in everyday life.",
                    "description": "AI is everywhere, from your phone's face unlock to the games you play! It's like teaching computers to be smart enough to do things that usually need human brains.",
                    "what_students_will_build": "Brainstorm and identify AI applications they already use.",
                    "concepts_learned": [
                        "Definition of AI",
                        "narrow AI vs. general AI",
                        "common AI applications"
                    ],
                    "tasks": [
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "questions": [
                                    {
                                        "success": "Correct!",
                                        "hint": "Which device needs to 'understand' language?",
                                        "answers": [
                                            { "text": "Calculator", "value": 0 },
                                            { "text": "Smart Speaker", "value": 1 },
                                            { "text": "Toaster", "value": 0 }
                                        ],
                                        "failed": "Not quite.",
                                        "text": "Which of these is most likely powered by AI?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "difficulty": 1,
                                "multi_choice": false,
                                "caption": "Quiz: Identifying AI",
                                "intro": "Let's see if you can spot the AI!"
                            }
                        },
                        {
                            "action": "text", // or "lecture"
                            "task_type": "html",
                            "metadata": {
                                "caption": "What is AI?",
                                "difficulty": 1,
                                "intro": "Let's learn the basic definition.",
                                "problem": "<h1>What is AI?</h1><p>Artificial Intelligence (AI) is the science of making computers do things that normally require human intelligence.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI in Your Life",
                                "intro": "Watch this short video to see how AI is part of your daily life.",
                                "video": "path/to/ai_in_life_video.mp4"
                            }
                        },
                        { // Example of fill-in-the-blank with options
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "caption": "Fill in the blank: AI",
                                "difficulty": 1,
                                "precode": "AI stands for Artificial {{}}.", // Text surrounding the blank options
                                "problem": "Complete the phrase: AI stands for Artificial ___________.",
                                "questions": [{ // Use questions structure for options
                                    "text": "What word completes the phrase 'Artificial ___'?", // This text might not be directly displayed if precode is used.
                                    "type": "blank_options",
                                    "answer": "1", // Value of the correct answer
                                    "answers": [
                                        { "text": "Automaton", "value": 0 },
                                        { "text": "Intelligence", "value": 1 },
                                        { "text": "Instructions", "value": 0 }
                                    ],
                                    "success": "That's it!",
                                    "failed": "Hmm, try another option."
                                }]
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "caption": "Activity: AI Scavenger Hunt",
                                "difficulty": 2,
                                "problem": "<h2>AI Scavenger Hunt</h2><p>Find 3 things in your home or school that use AI. List them and explain how they use it.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "questions": [
                                    {
                                        "success": "Correct!",
                                        "type": "option",
                                        "answers": [
                                            { "text": "True", "value": 0 },
                                            { "text": "False", "value": 1 }
                                        ],
                                        "text": "AI can think and feel emotions just like humans.",
                                        "answer": "1"
                                    }
                                ],
                                "difficulty": 2,
                                "caption": "Quiz: AI and Emotions"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "caption": "Brainstorm: AI in Future Jobs",
                                "difficulty": 2,
                                "problem": "<h2>Brainstorming AI's Future</h2><p>List 3 jobs that you think AI could help people with in the future.</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code", // General code task
                            "metadata": {
                                "drawing": true, // This suggests a visual component, not directly executable python in this context
                                "caption": "Draw Your AI",
                                "difficulty": 2,
                                "events": [
                                    { "caption": "description.txt", "key": "html" }
                                ],
                                "problem": "Draw a picture of an AI you imagine. In the text box, describe what it does.",
                                "code_language": "text", // Changed from html to text for description
                                "precode": {"text": "<!-- Describe your AI here -->"}
                                // No answer specified, so this task is "solved" on interaction/submission.
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "caption": "Discussion: AI for Homework",
                                "difficulty": 2,
                                "problem": "<h2>Discussion Prompt</h2><p>If AI could help you with your homework, what's one subject you'd want its help with and why?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "caption": "Reflection: What Surprised You?",
                                "difficulty": 1,
                                "problem": "<h2>Reflection</h2><p>Write one sentence about something that surprised you about AI in this lesson.</p>"
                            }
                        }
                    ]
                },
                // ... (rest of the lessons and modules, ensure difficulty and types are consistent)
                {
                    "lesson_id": 7.3,
                    "lesson_title": "Your First AI Call: Python Talks to the Cloud",
                    "aim": "To write a Python script that sends a prompt to an AI model and retrieves the response.",
                    "description": "Time to make Python talk to the AI cloud! We'll write real code that sends your question to an AI model and gets the answer back, all within your program.",
                    "what_students_will_build": "Write a Python script to make an API call to an AI model and print the response.",
                    "concepts_learned": ["Making API calls in Python", "handling API responses", "basic debugging of API calls"],
                    "tasks": [
                        {
                            "action": "lecture", // Changed from 'text' for clarity
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Hello, AI! Sending Your First Python Prompt",
                                "problem": "<h1>Making the Call</h1><p>Now we'll write a Python script to send a prompt to an AI model in the cloud and print its response right in our program.</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank", // This action type is specific to fill-in-the-code-blank
                            "metadata": {
                                "difficulty": 3,
                                "language": "python", // code_language could also be used
                                "precode": {
                                    "py": "response = openai.ChatCompletion.create(model=model, messages=messages, temperature=0)\nreturn response.choices[0].message[{{'content'}}]\n"
                                },
                                "solution": { "py": { "0": ["'content'"] } }, // Solution for the blank
                                "caption": "Code Challenge: Get Response Content"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code", // General coding task where student writes full code
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge: First API Call",
                                "problem": "Write a Python script using a helper function (imagine one called `get_ai_completion(prompt_text)`) to ask the AI: 'What is the biggest planet in our solar system?'. Print the response.",
                                "code_language": "python",
                                "precode": {"python": "# Assume get_ai_completion(prompt) function is available\n# Your code here\nprompt = \"What is the biggest planet in our solar system?\"\n# response = get_ai_completion(prompt)\n# print(response)"},
                                // Example of a verifiable answer
                                "answer": [{"python": "prompt = \"What is the biggest planet in our solar system?\"\nresponse = \"Jupiter is the largest planet in our solar system.\"\nprint(response) # Simplified for simulation"}],
                                "verification_type": "output_match_simulation" // Custom type for simulated check
                            }
                        },
                         {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What does a common AI helper function like `get_completion` primarily do?",
                                        "answers": [
                                            { "text": "Install Python libraries", "value": 0 },
                                            { "text": "Send prompts to an AI and return its response", "value": 1 },
                                            { "text": "Draw complex images", "value": 0 }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Helper Function Purpose"
                            }
                        },
                         {
                            "task_type": "html",
                            "action": "blank", // Free text blank
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Fill in the Blank: AI Response",
                                "problem": "Complete the sentence: The AI's answer often comes back as a {{}} in your Python program when working with text models.",
                                "precode": "The AI's answer often comes back as a {{}} in your Python program when working with text models.",
                                "answer": "The AI's answer often comes back as a {{string}} in your Python program when working with text models."
                                // No "questions" array means it's a free-text input blank.
                            }
                        }
                        // ... other tasks
                    ]
                }
            ]
        }
    ]
}
export default courseData
