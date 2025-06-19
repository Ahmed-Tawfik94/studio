
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
                                            {
                                                "text": "Calculator",
                                                "value": 0
                                            },
                                            {
                                                "text": "Smart Speaker",
                                                "value": 1
                                            },
                                            {
                                                "text": "Toaster",
                                                "value": 0
                                            }
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
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "auto_verify": true,
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
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "answer": "AI stands for Artificial {{Intelligence}}.",
                                "caption": "Fill in the blank: AI",
                                "difficulty": 1,
                                "precode": "AI stands for Artificial {{}}.",
                                "problem": "Complete the phrase: AI stands for Artificial ___________.",
                                "type": "text"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "auto_verify": false,
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
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "AI can think and feel emotions just like humans.",
                                        "answer": "1",
                                        "type": "option"
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
                                "auto_verify": false,
                                "caption": "Brainstorm: AI in Future Jobs",
                                "difficulty": 2,
                                "problem": "<h2>Brainstorming AI's Future</h2><p>List 3 jobs that you think AI could help people with in the future.</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "drawing": true,
                                "caption": "Draw Your AI",
                                "difficulty": 2,
                                "events": [
                                    {
                                        "caption": "description.txt",
                                        "key": "html"
                                    }
                                ],
                                "problem": "Draw a picture of an AI you imagine. In the text box, describe what it does.",
                                "code_language": "html",
                                "precode": {"html": "<!-- Describe your AI here -->"}
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "auto_verify": false,
                                "caption": "Discussion: AI for Homework",
                                "difficulty": 2,
                                "problem": "<h2>Discussion Prompt</h2><p>If AI could help you with your homework, what's one subject you'd want its help with and why?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "auto_verify": false,
                                "caption": "Reflection: What Surprised You?",
                                "difficulty": 1,
                                "problem": "<h2>Reflection</h2><p>Write one sentence about something that surprised you about AI in this lesson.</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 1.2,
                    "lesson_title": "The Magic of LLMs: Talking to AI!",
                    "aim": "To introduce Large Language Models (LLMs) and the concepts of prompts and completions.",
                    "description": "Imagine a super-duper brain that has read almost everything on the internet! That's kind of like an LLM. We'll learn about 'prompts' (your questions) and 'completions' (the AI's answers).",
                    "what_students_will_build": "Practice writing simple prompts and predicting AI completions.",
                    "concepts_learned": [
                        "Large Language Models (LLMs)",
                        "prompts",
                        "completions"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "LLMs: Your New Language Superpower",
                                "problem": "<h1>Large Language Models</h1><p>LLMs are a type of AI that are amazing at understanding and creating human-like language. They are trained on billions of words from books, articles, and websites.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "How LLMs Work",
                                "intro": "Watch a short animated video explaining how LLMs work at a high level (e.g., predicting the next word).",
                                "video": "path/to/how_llms_work.mp4"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "Answer",
                                                "value": 0
                                            },
                                            {
                                                "text": "Completion",
                                                "value": 0
                                            },
                                            {
                                                "text": "Prompt",
                                                "value": 1
                                            },
                                            {
                                                "text": "Output",
                                                "value": 0
                                            }
                                        ],
                                        "text": "What is the 'input' you give to an LLM called?",
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: LLM Terminology"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "The 'output' from an LLM is called a {{completion}}.",
                                "precode": "The 'output' from an LLM is called a {{}}.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Prompt Challenge",
                                "problem": "<h2>Prompt Challenge</h2><p>Write a prompt asking an LLM to 'tell you a short, funny story about a talking squirrel.'</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Prediction",
                                "problem": "<h2>Prediction Time</h2><p>If you gave the prompt 'What is the capital of France?', what would be a likely 'completion'?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 2,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "LLMs can only understand English.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: LLM Capabilities"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Brainstorm",
                                "problem": "<h2>Brainstorm</h2><p>List 3 different types of things you could ask an LLM to do (e.g., summarize, write, translate).</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why do you think LLMs need to be trained on 'billions of words'?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's the coolest thing you think an LLM could help you with in school?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 1.3,
                    "lesson_title": "Chatbot Adventure: Your First AI Conversation!",
                    "aim": "To get hands-on experience interacting with a simple online chatbot.",
                    "description": "Time to put your prompting skills to the test! We're going to talk to a real chatbot. You'll give it prompts, and it will give you completions!",
                    "what_students_will_build": "Interact directly with a publicly available, kid-friendly chatbot.",
                    "concepts_learned": [
                        "Practical application of prompts and completions",
                        "chatbot interaction",
                        "AI's strengths and limitations"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Let's Talk to a Chatbot",
                                "problem": "<h1>Chatbot Time</h1><p>In this lesson, you'll have a conversation with an AI. Remember to be clear with your questions to get the best answers!</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Chatbot Demo",
                                "intro": "Watch this to see how a chatbot conversation works.",
                                "video": "path/to/chatbot_demo.mp4"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Activity: Chatbot Explorer!",
                                "problem": "<h2>Chatbot Explorer!</h2><p>Open the provided link to a simple online chatbot. Your first task: Say 'Hi!'</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Prompt & Observe",
                                "problem": "<h2>Prompt & Observe</h2><p>Ask the chatbot 'What is your favorite color?' What does it say?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Creative Prompting",
                                "problem": "<h2>Creative Prompting</h2><p>Ask the chatbot to 'Write a haiku about nature.' Copy its response.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Problem-Solving",
                                "problem": "<h2>Problem-Solving</h2><p>Ask the chatbot 'How do I make a paper airplane?' Does it give clear instructions?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "An answer",
                                                "value": 0
                                            },
                                            {
                                                "text": "A completion",
                                                "value": 0
                                            },
                                            {
                                                "text": "A prompt",
                                                "value": 1
                                            },
                                            {
                                                "text": "A secret code",
                                                "value": 0
                                            }
                                        ],
                                        "text": "When you type a question into the chatbot, what are you giving it?",
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Chatbot Interaction"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Scenario: Birthday Planner",
                                "problem": "<h2>Scenario</h2><p>If you wanted the chatbot to help you plan a birthday party, what are three questions (prompts) you would ask it?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Do you think the chatbot 'understood' your questions, or was it just really good at predicting the next words?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What was the most fun or surprising part about talking to the chatbot?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 2,
            "module_title": "Talking to AI: The Art of Prompt Engineering",
            "aim": "Teach students how to write clear and effective prompts to get the best results from AI models.",
            "description": "Imagine you're giving instructions to a super-smart robot. If your instructions are messy, the robot might get confused! In this module, you'll become a 'Prompt Engineer,' learning cool tricks to talk to AI.",
            "what_students_will_build": "Experiment with a simple prompt engineering sandbox to summarize text, create structured lists, and try 'few-shot' prompting.",
            "concepts_learned": [
                "Clear instructions",
                "using delimiters",
                "structured output",
                "few-shot prompting",
                "prompt injection"
            ],
            "lessons": [
                {
                    "lesson_id": 2.1,
                    "lesson_title": "The Power of Clarity: Be Specific!",
                    "aim": "To understand the importance of clear and specific instructions when prompting AI.",
                    "description": "AI is smart, but it's not a mind-reader! If you want a great answer, you need to ask a great question. We'll learn why being super clear is like giving the AI a perfect map to the answer.",
                    "what_students_will_build": "Practice rephrasing vague prompts into clear and specific ones.",
                    "concepts_learned": [
                        "Clear and specific instructions",
                        "impact of prompt length",
                        "vague vs. specific language"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Why Your AI Needs Crystal Clear Instructions",
                                "problem": "<h1>Be Specific!</h1><p>The golden rule of prompting is: the clearer your instruction, the better the AI's response will be. Vague questions lead to vague answers.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Garbage In, Garbage Out",
                                "intro": "Watch this short video explaining the 'garbage in, garbage out' concept in AI prompting.",
                                "video": "path/to/gigo_video.mp4"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "'Tell me about animals.'",
                                                "value": 0
                                            },
                                            {
                                                "text": "'List 5 facts about penguins.'",
                                                "value": 1
                                            }
                                        ],
                                        "text": "Which prompt is more specific?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Specificity"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "A good prompt tells the AI exactly what you want it to {{do}}.",
                                "precode": "A good prompt tells the AI exactly what you want it to {{}}.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Rephrase Challenge 1",
                                "problem": "Take the vague prompt 'Write something about space.' Rephrase it to be super specific (e.g., ask for a short story about an astronaut's first trip to Mars). Write your new prompt in the text area.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Rephrase Challenge 2",
                                "problem": "Take the vague prompt 'Give me information about history.' Rephrase it to be specific (e.g., 'Summarize the key events of the American Revolution in 3 sentences.').",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a pseudo-code prompt (like simple instructions) to ask an AI to calculate the area of a rectangle, given its length and width.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "A short prompt is always clearer than a long prompt.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Prompt Length"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why might an AI give a 'bad' or irrelevant answer if your prompt isn't clear?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think about a time you gave instructions that weren't clear. How did that relate to AI prompts?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 2.2,
                    "lesson_title": "Secret Codes for AI: Using Delimiters and Structured Output",
                    "aim": "To learn how to use delimiters to separate parts of an input and request structured outputs.",
                    "description": "Delimiters are like special containers or fences for your prompt! They tell the AI exactly which part is the main text and which part is the instruction. We'll also learn to ask AI for answers in neat, organized ways, like lists or tables.",
                    "what_students_will_build": "Practice using delimiters (e.g., triple backticks) and requesting outputs in specific formats (e.g., lists, JSON).",
                    "concepts_learned": [
                        "Delimiters",
                        "structured output (lists, JSON)",
                        "preventing prompt injection"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Delimiters: Your AI's Best Friend",
                                "problem": "<h1>Using Delimiters</h1><p>Delimiters like ```, ''', or <> help the AI understand the different parts of your prompt. You can use them to separate instructions from the text you want the AI to process.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "How Delimiters Work",
                                "intro": "Short animated video showing how delimiters help the AI isolate the main text.",
                                "video": "path/to/delimiters_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt asking an AI to summarize the following poem. Make sure to put the poem inside triple backticks.\n\n```\nThe cat sat on the mat,\nThe dog played with the ball.\nThe bird flew to the tree,\nAnd watched them all.\n```",
                                "code_language": "text",
                                "precode": {
                                    "text": "Summarize the following text in one sentence:\n\n'''\n[Your text here]\n'''"
                                },
                                "answer": [
                                    {
                                        "text": "Summarize the following poem in one sentence:\n\n```\nThe cat sat on the mat,\nThe dog played with the ball.\nThe bird flew to the tree,\nAnd watched them all.\n```"
                                    }
                                ],
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "```",
                                                "value": 0
                                            },
                                            {
                                                "text": "'''",
                                                "value": 0
                                            },
                                            {
                                                "text": "@@@",
                                                "value": 1
                                            },
                                            {
                                                "text": "< >",
                                                "value": 0
                                            }
                                        ],
                                        "text": "Which of these is NOT a common delimiter?",
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Delimiters"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "Delimiters help prevent {{prompt injection}} by clearly separating instructions from other text.",
                                "precode": "Delimiters help prevent {{}} by clearly separating instructions from other text.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Structured Output Challenge 1 (List)",
                                "problem": "<h2>Challenge</h2><p>Write a prompt asking the AI to list 5 fun facts about the moon in a bulleted list format.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Structured Output Challenge 2 (JSON)",
                                "problem": "<h2>Challenge</h2><p>Write a prompt asking the AI to create a JSON object with your name, age, and favorite hobby as keys and your actual info as values.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "Asking for structured output means the AI will only give you a long paragraph.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Structured Output"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it useful to get an AI's answer in a structured format like a list or JSON, especially if you want to use that information in another computer program?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think about a time you needed information organized. How could delimiters and structured output help with that in the future?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 2.3,
                    "lesson_title": "AI as a Rule Follower: Checking Conditions and Few-Shot Learning",
                    "aim": "To teach students how to make AI check conditions and learn from examples.",
                    "description": "What if you could tell AI, 'If THIS happens, do THAT'? You can! This is called 'checking conditions.' And even cooler, you can *show* the AI how to do something by giving it examples. This is called 'few-shot prompting.'",
                    "what_students_will_build": "Practice creating prompts that include conditions and provide 'few-shot' examples.",
                    "concepts_learned": [
                        "Checking conditions",
                        "few-shot prompting",
                        "consistency in AI responses"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI's Rules: If This, Then That!",
                                "problem": "<h1>Checking Conditions</h1><p>You can instruct the AI to follow simple rules or conditions. This helps in creating more predictable and controlled outputs.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Few-Shot Prompting Explained",
                                "intro": "Watch a video explaining how 'few-shot' prompting works with examples.",
                                "video": "path/to/few_shot_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "You have a text: ```The dog barked loudly.``` Write a prompt for the AI: 'If the text delimited by triple quotes contains the word 'dog', say 'Woof!'. Otherwise, say 'No dog found.''.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "To make the AI faster",
                                                "value": 0
                                            },
                                            {
                                                "text": "To teach the AI by example",
                                                "value": 1
                                            },
                                            {
                                                "text": "To make the AI smarter than you",
                                                "value": 0
                                            }
                                        ],
                                        "text": "What is the goal of 'few-shot' prompting?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Few-Shot Prompting"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "When you give the AI an example of how to respond before asking a new question, it's called {{few-shot}} prompting.",
                                "precode": "When you give the AI an example of how to respond before asking a new question, it's called {{}} prompting.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Few-Shot Challenge 1 (Style)",
                                "problem": "<h2>Challenge</h2><p>Provide this example to an AI: 'Human: What is a cloud? AI: A fluffy water vapor floating in the sky.' Now, using few-shot, ask the AI: 'Human: What is a rainbow?'</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Conditional Prompt 2",
                                "problem": "<h2>Challenge</h2><p>Write a prompt that asks the AI: 'If the following sentence is a question, say 'You asked a question!'. If not, say 'That's a statement.' Is the sky blue?'</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "Few-shot prompting is only useful for very large AI models.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Few-Shot Usefulness"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>How could asking an AI to 'check conditions' be helpful in a real-world app, like a chatbot for a library?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think about a time you learned something by example. How is that similar to how few-shot prompting works for AI?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 3,
            "module_title": "Give AI Time to Think: Advanced Prompting Fun!",
            "aim": "Introduce techniques that encourage AI models to 'think' step-by-step for more accurate and helpful responses.",
            "description": "Sometimes, even super-smart AIs need a little help to get to the right answer. Just like solving a math problem, it helps to break it down into steps! In this module, you'll learn how to guide the AI to work through problems step-by-step.",
            "what_students_will_build": "Design prompts that ask the AI to follow specific steps to complete a task and evaluate a 'student's solution' to a problem.",
            "concepts_learned": [
                "Breaking down tasks",
                "instructing the model to work out its own solution",
                "iterative prompting"
            ],
            "lessons": [
                {
                    "lesson_id": 3.1,
                    "lesson_title": "Step-by-Step AI: Guiding the Process",
                    "aim": "To learn how to instruct AI to follow a sequence of steps to complete a task.",
                    "description": "AI works best with clear steps! We'll practice telling the AI exactly what actions to perform and in what order.",
                    "what_students_will_build": "Create multi-step prompts for AI to follow for complex tasks like summarization and translation.",
                    "concepts_learned": [
                        "Specifying steps in a prompt",
                        "sequential processing",
                        "breaking down complex tasks"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI's Checklist: The Power of Step-by-Step Prompts",
                                "problem": "<h1>Step-by-Step</h1><p>For complex tasks, you can instruct the AI to follow a series of steps. This improves accuracy and gives you more control over the output.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Multi-Step AI Responses",
                                "intro": "Watch a short video demonstrating a multi-step AI response (e.g., summarize, then translate).",
                                "video": "path/to/multistep_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt for the AI to perform two actions on a given text: 1) Summarize it in one sentence. 2) Translate the summary into Spanish. Use clear numbering for steps.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "It makes the AI faster",
                                                "value": 0
                                            },
                                            {
                                                "text": "It ensures accurate and structured output",
                                                "value": 1
                                            },
                                            {
                                                "text": "It confuses the AI",
                                                "value": 0
                                            }
                                        ],
                                        "text": "Why is it helpful to specify steps for an AI?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Benefits of Steps"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "When giving AI multiple actions to perform, it's best to {{number}} the steps.",
                                "precode": "When giving AI multiple actions to perform, it's best to {{}} the steps.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Multi-Action Prompt",
                                "problem": "<h2>Challenge</h2><p>Write a prompt for the AI to: 1) Generate 3 ideas for a new superhero. 2) For each superhero, list one superpower and one weakness.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Order Matters",
                                "problem": "<h2>Challenge</h2><p>If you tell the AI to '1) Translate to French, 2) Summarize', will the result be the same as '1) Summarize, 2) Translate to French'? Why or why not?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "You can only give an AI one instruction per prompt.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Multiple Instructions"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Think of a school project. How could breaking it into steps, and then asking an AI to help with each step, make the project easier?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's one example from your daily life where breaking a task into steps is very important?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 3.2,
                    "lesson_title": "AI as a Smart Grader: Solving Before Judging",
                    "aim": "To instruct AI models to work out their own solutions before evaluating another's answer.",
                    "description": "Imagine your AI is a super-smart detective! Before it tells you if someone else's answer is right, it first solves the puzzle itself to make sure it knows the real answer.",
                    "what_students_will_build": "Create prompts where the AI first solves a problem and then compares its solution to a provided one.",
                    "concepts_learned": [
                        "Instructing AI to self-verify",
                        "step-by-step reasoning",
                        "comparative analysis"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI's Inner Monologue: Solve It Before You Grade It!",
                                "problem": "<h1>Self-Correction</h1><p>A powerful technique is to ask the model to work out its own solution before judging a user's answer. This prevents the AI from being biased by the provided (and possibly incorrect) solution.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI Self-Correction Demo",
                                "intro": "Short animation showing the AI's internal process: solve -> compare -> evaluate.",
                                "video": "path/to/self_correct_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt for the AI to act as a grader. Give it a math question (e.g., 'What is 5 + 7?'), and a 'student's solution' (e.g., '10'). Tell the AI to first calculate its own answer, then compare it to the student's, and finally say if the student is 'correct' or 'incorrect'.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "Compare to student's",
                                                "value": 0
                                            },
                                            {
                                                "text": "Work out its own solution",
                                                "value": 1
                                            },
                                            {
                                                "text": "Ask for a hint",
                                                "value": 0
                                            }
                                        ],
                                        "text": "What is the first step the AI should take when asked to grade a student's solution using this tactic?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Grading Process"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "This tactic helps the AI avoid rushing to a {{conclusion}} before thinking it through.",
                                "precode": "This tactic helps the AI avoid rushing to a {{}} before thinking it through.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Grading Scenario 1",
                                "problem": "<h2>Challenge</h2><p>Provide the AI with a simple logic problem (e.g., 'If all cats are animals, and Mittens is a cat, is Mittens an animal?'). Give a 'student's solution' that is correct. Write the prompt for the AI to grade it using the self-correction method.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Grading Scenario 2",
                                "problem": "<h2>Challenge</h2><p>Use the same logic problem as above, but give a 'student's solution' that is incorrect. Write the prompt for the AI to grade it.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "The AI will always agree with the student's solution if this tactic is used.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: AI Agreement"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it important for an AI (or a human!) to solve a problem themselves before deciding if someone else's answer is right or wrong?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>How can this 'solve first, then compare' idea make AI more trustworthy in its evaluations?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 3.3,
                    "lesson_title": "Iterate and Improve: Making Prompts Even Better!",
                    "aim": "To understand the iterative process of prompt engineering to refine AI outputs.",
                    "description": "Prompt engineering is like building with LEGOs. You build a bit, see if it looks good, and then tweak it! This is called 'iterative prompting' – it's all about trying, checking, and improving.",
                    "what_students_will_build": "Take an initial prompt and iteratively refine it based on AI's unsatisfactory outputs to achieve desired results.",
                    "concepts_learned": [
                        "Iterative process",
                        "trial and error",
                        "refining prompts",
                        "troubleshooting AI responses"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "The Prompt Cycle: Try, Tweak, Succeed!",
                                "problem": "<h1>Iterative Prompting</h1><p>It's rare to write the perfect prompt on the first try. The key is to analyze the AI's output and refine your prompt until you get the result you want. This is the iterative loop of prompt engineering.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "The Iterative Loop",
                                "intro": "Video illustrating the iterative prompt engineering loop (idea -> prompt -> run -> analyze -> refine).",
                                "video": "path/to/iteration_video.mp4"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Activity (Online Tool)",
                                "problem": "<h2>Activity</h2><p>Use a simple online prompt playground. Start with the prompt: 'Write a product description for a chair.' Observe the output.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Refinement 1",
                                "problem": "<h2>Refinement</h2><p>The description is too long. Modify the prompt from the previous task to: 'Write a product description for a chair. Use at most 50 words.' Observe the new output.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Refinement 2",
                                "problem": "<h2>Refinement</h2><p>The description focuses on the wrong details. Modify the prompt further: 'Write a product description for a chair. It's for furniture retailers, so focus on the materials. Use at most 50 words.' Observe the new output.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Refinement 3",
                                "problem": "<h2>Refinement</h2><p>You want a product ID. Modify the prompt again: 'Write a product description for a chair... Include any 7-character product IDs from the technical specs. Use at most 50 words.' (Provide a dummy ID like 'SWC-100' in a 'technical specs' section for them to include).</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "Give up",
                                                "value": 0
                                            },
                                            {
                                                "text": "Check if the AI's response is what you wanted",
                                                "value": 1
                                            },
                                            {
                                                "text": "Ask a new question entirely",
                                                "value": 0
                                            }
                                        ],
                                        "text": "What do you do in the 'analyze' step of iterative prompting?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Iteration Steps"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "Iterative prompting means you keep {{refining}} your prompt until you get the desired result.",
                                "precode": "Iterative prompting means you keep {{}} your prompt until you get the desired result.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it rare to get a perfect AI response with your very first prompt, especially for a complex task?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think of a time you built or created something. How did you improve it over time? How is that similar to iterative prompting?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 4,
            "module_title": "AI as Your Assistant: Summarizing & Inferring",
            "aim": "Explore how AI can summarize long texts and infer information like sentiment or topics.",
            "description": "Imagine having a magical assistant who can read a super long book and tell you the main idea in just a few sentences! Or tell you if someone is happy or sad from their message. That's what we'll do with AI!",
            "what_students_will_build": "Use AI to summarize product reviews, determine the sentiment of text, and extract key information.",
            "concepts_learned": [
                "Text summarization",
                "sentiment analysis",
                "emotion detection",
                "information extraction",
                "topic inference"
            ],
            "lessons": [
                {
                    "lesson_id": 4.1,
                    "lesson_title": "Speedy Summaries: Get the Gist with AI",
                    "aim": "To use AI to create concise summaries of longer texts with specific constraints.",
                    "description": "Ever had to read a super long article but only needed the main idea? AI can do that for you in a flash! We'll learn how to tell the AI to summarize text and even how to make sure the summary is a certain number of words.",
                    "what_students_will_build": "Practice summarizing various texts under different length constraints.",
                    "concepts_learned": [
                        "Summarization",
                        "controlling summary length",
                        "generating targeted feedback"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Summarize It! AI's Superpower",
                                "problem": "<h1>Summarization</h1><p>AI is excellent at taking a long piece of text and condensing it into its most important points. You can control the output by specifying constraints like word count or focus.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI Summarization Demo",
                                "intro": "Watch a video demonstrating how AI summarizes text.",
                                "video": "path/to/summarization_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Given a short product review (e.g., 'This toy is super cute and soft, but a bit small for the price.'), write a prompt to summarize it in at most 10 words.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "To make the text longer",
                                                "value": 0
                                            },
                                            {
                                                "text": "To extract every detail",
                                                "value": 0
                                            },
                                            {
                                                "text": "To get the main idea concisely",
                                                "value": 1
                                            }
                                        ],
                                        "text": "What is the main goal of summarization?",
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Goal of Summarization"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "You can tell the AI to summarize text by limiting the number of {{words}}, sentences, or characters.",
                                "precode": "You can tell the AI to summarize text by limiting the number of {{}}, sentences, or characters.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Department Feedback (Shipping)",
                                "problem": "<h2>Challenge</h2><p>Given a review (e.g., 'The package arrived a day early!'), write a prompt to summarize it in at most 15 words, focusing *only* on shipping/delivery.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Department Feedback (Pricing)",
                                "problem": "<h2>Challenge</h2><p>Given a review (e.g., 'Good product, but quite expensive.'), write a prompt to summarize it in at most 15 words, focusing *only* on price/value.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 2,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "Using 'extract' instead of 'summarize' will give you a condensed version of the whole text.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Extract vs Summarize"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Imagine you're reviewing a new movie. How would AI summarization help a website give quick highlights to potential viewers?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's a real-life scenario where you would use AI to summarize something for you?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 4.2,
                    "lesson_title": "AI the Detective: Inferring Sentiment and Emotion",
                    "aim": "To infer sentiment (positive/negative) and identify specific emotions from text using AI.",
                    "description": "Can AI tell if someone is happy, sad, or even angry just by reading their words? Yes! This is called 'inferring' sentiment and emotion. We'll train our AI detective to figure out how someone feels about a product or a situation.",
                    "what_students_will_build": "Practice prompting AI to identify sentiment and a list of emotions from various review texts.",
                    "concepts_learned": [
                        "Sentiment analysis",
                        "emotion detection",
                        "customer service applications"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI's Feelings Detector: Understanding Sentiment",
                                "problem": "<h1>Sentiment Analysis</h1><p>AI can infer the underlying feeling or emotion in a piece of text. This is called sentiment analysis and it's widely used to understand customer feedback.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Sentiment Analysis Examples",
                                "intro": "Watch a video on sentiment analysis examples.",
                                "video": "path/to/sentiment_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Given a lamp review text (e.g., 'Great lamp! Super happy with it!'), write a prompt to determine its sentiment (positive/negative) and output just one word.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "Positive",
                                                "value": 0
                                            },
                                            {
                                                "text": "Negative",
                                                "value": 1
                                            },
                                            {
                                                "text": "Neutral",
                                                "value": 0
                                            }
                                        ],
                                        "text": "If a review says 'This product broke quickly!', what is its sentiment?",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Sentiment Detection"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "Identifying if a review is positive or negative is called {{sentiment}} analysis.",
                                "precode": "Identifying if a review is positive or negative is called {{}} analysis.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Emotion Hunt",
                                "problem": "<h2>Challenge</h2><p>Given a sentence (e.g., 'I'm so frustrated, this game keeps crashing!'), write a prompt to identify no more than three emotions expressed, in lowercase and comma-separated.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Anger Detector",
                                "problem": "<h2>Challenge</h2><p>Given a sentence (e.g., 'This is outrageous, I can't believe this happened!'), write a prompt asking if the writer is expressing anger (yes/no answer).</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "text": "AI can understand every subtle human emotion perfectly, just like a person.",
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: AI and Emotion"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why would a company want to use AI to figure out the sentiment of customer reviews?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think about a message you recently sent. If AI analyzed it, what sentiment do you think it would detect?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 4.3,
                    "lesson_title": "Digging for Details: Extracting Information and Topics",
                    "aim": "To use AI to extract specific information (like product names) and infer main topics from text.",
                    "description": "AI can be a super-efficient information extractor! We'll teach it how to pull out important details like the name of a product or the company that made it, and also identify the main topics in an article.",
                    "what_students_will_build": "Practice extracting specific entities and inferring topics from given texts.",
                    "concepts_learned": [
                        "Information extraction",
                        "topic inference",
                        "structuring data (JSON)",
                        "multi-task prompting"
                    ],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI's Data Miner: Pulling Out Key Info",
                                "problem": "<h1>Information Extraction</h1><p>Beyond sentiment, AI can extract specific pieces of information (like names, places, or topics) from a body of text. This is useful for organizing unstructured data.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Information Extraction Demo",
                                "intro": "Video illustrating information extraction from text.",
                                "video": "path/to/extraction_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Given a review (e.g., 'I love my new Lumina lamp!'), write a prompt to extract the item purchased and the company name, formatted as a JSON object with keys 'Item' and 'Brand'. Use 'unknown' if info is missing.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "Summarizing",
                                                "value": 0
                                            },
                                            {
                                                "text": "Inferring sentiment",
                                                "value": 0
                                            },
                                            {
                                                "text": "Extracting information",
                                                "value": 1
                                            }
                                        ],
                                        "text": "If a company uses AI to find all product names mentioned in reviews, what task is it performing?",
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Task Identification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "To get a structured answer for extracted information, you can ask for a {{JSON}} object.",
                                "precode": "To get a structured answer for extracted information, you can ask for a {{}} object.",
                                "problem": "Complete the sentence."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Topic Inference (List)",
                                "problem": "<h2>Challenge</h2><p>Given a short news story (e.g., about a new space mission), write a prompt to determine 3 main topics discussed, each 1-2 words long, in a comma-separated list.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Multi-Tasking AI",
                                "problem": "<h2>Challenge</h2><p>Write a single prompt that asks the AI to: 1) determine the sentiment (positive/negative), 2) check if anger is expressed (true/false), and 3) extract the product and brand from a review, all in one JSON output.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 1
                                            },
                                            {
                                                "text": "False",
                                                "value": 0
                                            }
                                        ],
                                        "text": "You can ask an AI to do multiple different tasks in one single prompt.",
                                        "answer": "0",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Multi-Tasking"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>How could identifying topics in news articles using AI help you stay updated on subjects you care about?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What kind of information would you like AI to extract for you from your favorite book or movie summary?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 5,
            "module_title": "AI the Transformer: Translating & Rewriting",
            "aim": "Discover AI's capabilities in transforming text, including translation, tone adjustment, and grammar correction.",
            "description": "AI isn't just good at understanding; it's also a master of changing things! We'll see how AI can instantly translate languages, change the tone of a message from casual to professional, and fix grammar mistakes.",
            "what_students_will_build": "Translate text, transform tone, convert data formats (JSON to HTML), and use AI for spellcheck.",
            "concepts_learned": [
                "Language translation",
                "tone transformation",
                "format conversion",
                "spellcheck/grammar correction"
            ],
            "lessons": [
                {
                    "lesson_id": 5.1,
                    "lesson_title": "The Universal Translator",
                    "aim": "To use AI to translate text between different languages and styles.",
                    "description": "Bonjour! Hola! Konnichiwa! AI can speak almost any language. We'll learn how to make AI our personal translator, even translating into fun styles like Pirate speak!",
                    "what_students_will_build": "Practice translating phrases into various languages and adjusting for formality.",
                    "concepts_learned": ["Multi-language translation", "formal/informal translation", "creative translation styles"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI: Your Personal Translator",
                                "problem": "<h1>Translation</h1><p>Large Language Models are trained on text from many languages, making them powerful universal translators.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Real-time AI Translation",
                                "video": "path/to/translation_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt to translate 'Hello, how are you?' into Spanish.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "Which language do you think AI is NOT trained on?",
                                        "answers": [
                                            {
                                                "text": "Spanish",
                                                "value": 0
                                            },
                                            {
                                                "text": "French",
                                                "value": 0
                                            },
                                            {
                                                "text": "Korean",
                                                "value": 0
                                            },
                                            {
                                                "text": "A made-up language",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "3",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Language Training"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "AI's ability to translate comes from being trained on sources in many {{languages}}.",
                                "precode": "AI's ability to translate comes from being trained on sources in many {{}}."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Multi-Language Translation",
                                "problem": "<h2>Challenge</h2><p>Write a prompt to translate 'I want a slice of pizza' into French, Spanish, and English Pirate.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Formal/Informal",
                                "problem": "<h2>Challenge</h2><p>Write a prompt to translate 'Can I have some water?' into both formal and informal Spanish.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "AI can only translate one word at a time.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Translation Scope"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>How could AI translation help someone traveling to a country where they don't speak the local language?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>If you could instantly learn any language with AI's help, which one would it be and why?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 5.2,
                    "lesson_title": "AI as a Master of Style: Tone and Format Transformation",
                    "aim": "To use AI to change the tone of text and convert data between formats.",
                    "description": "AI can be a chameleon! It can take a super casual text message and make it sound like a formal business email. It can also change information from one computer language (like JSON) to another (like an HTML table).",
                    "what_students_will_build": "Practice transforming text tone and converting simple JSON data to HTML lists.",
                    "concepts_learned": ["Tone transformation (casual to formal)", "data format conversion (JSON to HTML)"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI: The Text Stylist & Transformer",
                                "problem": "<h1>Tone and Format</h1><p>AI can rewrite text to change its tone (e.g., from casual to formal) and convert information from one format to another (e.g., JSON to an HTML table).</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Tone Transformation",
                                "intro": "Short video showing examples of tone transformation (e.g., casual to business).",
                                "video": "path/to/tone_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt to translate 'Yo, this movie is sick!' into a formal, polite sentence.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What does 'tone transformation' mean for AI?",
                                        "answers": [
                                            {
                                                "text": "Changing the color of text",
                                                "value": 0
                                            },
                                            {
                                                "text": "Changing how the text sounds/feels",
                                                "value": 1
                                            },
                                            {
                                                "text": "Translating the text",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Tone"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "AI can convert data from one {{format}} (like JSON) to another (like HTML).",
                                "precode": "AI can convert data from one {{}} (like JSON) to another (like HTML)."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Casual to Formal",
                                "problem": "<h2>Challenge</h2><p>Take a casual sentence (e.g., 'Hey, wanna hang out later?') and write a prompt to transform its tone to sound more professional.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "JSON to List",
                                "problem": "<h2>Challenge</h2><p>Given a simple JSON object like `{\"item\": \"apple\", \"price\": 1.00}`, write a prompt to convert it into a simple bulleted list.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "AI can only transform text into a more casual tone.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Tone Direction"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why would a business want to use AI to change the tone of their messages?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>How could AI converting data into an HTML table be useful for someone who wants to build a simple website?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 5.3,
                    "lesson_title": "AI as Your Editor: Spellcheck and Grammar Guru",
                    "aim": "To use AI for proofreading, correcting grammar, and improving text clarity.",
                    "description": "Oops, a typo! Everyone makes mistakes, but AI can be your personal grammar guru. It can spot spelling errors, fix grammar, and even suggest ways to make your writing clearer and more compelling.",
                    "what_students_will_build": "Practice using AI to correct sentences with errors and improve short paragraphs.",
                    "concepts_learned": ["Proofreading", "grammar correction", "style improvement", "homonym correction"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI: Your Personal Proofreader",
                                "problem": "<h1>Proofreading</h1><p>AI can be used as a powerful proofreader to check for spelling and grammar mistakes and even suggest ways to improve clarity and style.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "AI Grammar Correction",
                                "video": "path/to/grammar_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge (Pseudo-code)",
                                "problem": "Write a prompt to proofread and correct this sentence: 'Their are many freinds going to the park.'",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What can AI help with in writing?",
                                        "answers": [
                                            {
                                                "text": "Spelling",
                                                "value": 0
                                            },
                                            {
                                                "text": "Grammar",
                                                "value": 0
                                            },
                                            {
                                                "text": "Making text more compelling",
                                                "value": 0
                                            },
                                            {
                                                "text": "All of the above",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "3",
                                        "type": "option_multiple"
                                    }
                                ],
                                "caption": "Quiz: Writing Help"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "AI can help {{proofread}} and {{correct}} your text for clarity.",
                                "precode": "AI can help {{}} and {{}} your text for clarity."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Sentence Correction",
                                "problem": "<h2>Challenge</h2><p>Give the AI a sentence with a homonym error (e.g., 'Its a beautiful day to go too the beach.'). Write a prompt to correct it.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Paragraph Improvement",
                                "problem": "<h2>Challenge</h2><p>Take a short, simple paragraph you've written. Write a prompt asking the AI to 'proofread and correct this paragraph. Make it more compelling and sound like it's for an advanced reader.'</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "AI can only fix mistakes, it can't make writing sound better.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Beyond Mistakes"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>How could using AI to proofread help you get better grades on your written assignments?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's one common grammar mistake you often make that AI could help you spot?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 6,
            "module_title": "Making AI Chatbots: Your First Conversational Pal",
            "aim": "Introduce the basics of building a simple AI chatbot and managing conversation history.",
            "description": "Ever chatted with a bot online? Now you can build your own! We'll explore how they remember what you say and how to make them respond in a friendly or even Shakespearean style!",
            "what_students_will_build": "Create a basic chatbot with a defined personality, manage a simple conversation flow, and build a mini 'OrderBot'.",
            "concepts_learned": [
                "Chatbot fundamentals",
                "conversation history",
                "system/user/assistant messages",
                "temperature"
            ],
            "lessons": [
                {
                    "lesson_id": 6.1,
                    "lesson_title": "Chatbot Basics: Who's Talking Here?",
                    "aim": "To understand the roles in a chatbot conversation (system, user, assistant).",
                    "description": "Every chatbot conversation has characters! There's the 'System' (who tells the AI how to act), the 'User' (that's you!), and the 'Assistant' (the AI's replies). We'll learn how to set the AI's personality.",
                    "what_students_will_build": "Identify roles in sample conversations and write system messages to define chatbot personalities.",
                    "concepts_learned": ["System messages", "user messages", "assistant messages", "chatbot personality"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Chatbot Roles: The Cast of Your AI Conversation",
                                "problem": "<h1>Chatbot Roles</h1><p>A chatbot conversation has three main roles: the <b>System</b> (sets the AI's personality), the <b>User</b> (that's you!), and the <b>Assistant</b> (the AI's response).</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Chatbot Message Flow",
                                "video": "path/to/chatbot_roles_video.mp4"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "Which role tells the AI what kind of character it should be?",
                                        "answers": [
                                            {
                                                "text": "User",
                                                "value": 0
                                            },
                                            {
                                                "text": "Assistant",
                                                "value": 0
                                            },
                                            {
                                                "text": "System",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Chatbot Roles"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "Your questions or inputs to the chatbot are called {{user}} messages.",
                                "precode": "Your questions or inputs to the chatbot are called {{}} messages."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Role Play Identification",
                                "problem": "<h2>Challenge</h2><p>Given a conversation: 'System: You are a friendly cat. User: Meow! Assistant: Purr.' - identify the role of each line.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Set the Stage",
                                "problem": "<h2>Challenge</h2><p>Write a 'system' message to make a chatbot act like a super-excited sports announcer.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "The 'assistant' is the human talking to the chatbot.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Assistant Role"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Brainstorm",
                                "problem": "<h2>Brainstorm</h2><p>Besides 'friendly' or 'Shakespearean', what other fun personalities could you give a chatbot through a system message?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it important for the 'system' to set the rules or personality for the chatbot at the beginning?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>Think about a character from a book or movie. How would you describe their 'personality' using a simple system message for an AI?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 6.2,
                    "lesson_title": "Remembering the Past: Chatbot Memory",
                    "aim": "To understand how chatbots maintain conversation history and how 'temperature' affects responses.",
                    "description": "A good chatbot remembers what you've said! This 'memory' is called conversation history. We'll also explore 'temperature' – a setting that makes AI responses more predictable or more creative.",
                    "what_students_will_build": "Experiment with chatbot memory and temperature settings in an online tool.",
                    "concepts_learned": ["Conversation history", "temperature setting", "predictability vs. creativity"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Chatbot's Brain: How They Remember",
                                "problem": "<h1>Conversation History</h1><p>Good chatbots remember the conversation history. This allows them to refer back to earlier messages, creating a more natural and coherent dialogue.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Temperature Explained",
                                "intro": "'Temperature' is a setting that controls the randomness of the AI's response. Low temperature is predictable, high temperature is creative.",
                                "video": "path/to/temperature_video.mp4"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Activity (Online Tool)",
                                "problem": "<h2>Activity</h2><p>Interact with a chatbot that remembers history. Say, 'Hi, my name is Alex.' Then, ask, 'What is my name?' Observe if it remembers.</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "If a chatbot forgets your name after you told it, what is it likely NOT doing?",
                                        "answers": [
                                            {
                                                "text": "Using a system message",
                                                "value": 0
                                            },
                                            {
                                                "text": "Maintaining conversation history",
                                                "value": 1
                                            },
                                            {
                                                "text": "Giving a completion",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Chatbot Memory"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "The 'temperature' setting controls the degree of {{randomness}} or creativity in the AI's output.",
                                "precode": "The 'temperature' setting controls the degree of {{}} or creativity in the AI's output."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Temperature Experiment",
                                "problem": "<h2>Challenge</h2><p>Write a prompt for the AI to 'Tell me a short story.' Then describe how you'd expect the story to change if you ran it with a very low temperature (e.g., 0) vs. a very high temperature (e.g., 1).</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Why Memory?",
                                "problem": "<h2>Challenge</h2><p>Why is 'memory' (conversation history) important for a chatbot that helps with customer service?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "A 'temperature' of 0 will usually result in more creative and random outputs.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Temperature Effects"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>If you were designing a chatbot for a school project, what kind of 'temperature' setting would you choose and why?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>How is a chatbot's 'memory' different from how a human remembers things?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 6.3,
                    "lesson_title": "Building Your First Chatbot: The OrderBot Challenge!",
                    "aim": "To apply chatbot concepts to build a simple OrderBot for a pizza place.",
                    "description": "Let's make a chatbot that takes pizza orders! Your OrderBot will greet customers, ask for their pizza size and toppings, and then summarize the order. This is like building a mini-employee for a pizza shop!",
                    "what_students_will_build": "Design the conversation flow and implement a simplified OrderBot using Python code snippets or a visual tool.",
                    "concepts_learned": ["Chatbot design", "conversation flow", "collecting information", "summarizing orders", "practical application of chatbot roles"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Your First AI Assistant: The OrderBot",
                                "problem": "<h1>The OrderBot</h1><p>Let's build a chatbot for a pizza place! It will greet customers, take their order (including size and toppings), and summarize everything.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "OrderBot Functionality Demo",
                                "video": "path/to/orderbot_video.mp4"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 3,
                                "language": "python",
                                "precode": {
                                    "py": "def get_completion_from_messages(messages, model=\"gpt-3.5-turbo\", temperature=0):\n    response = openai.ChatCompletion.{{create}}(\n        model=model,\n        messages=messages,\n        temperature=temperature,\n    )\n    return response.choices[0].message[\"content\"]"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "create"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Fill in the Blank"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 3,
                                "language": "python",
                                "precode": {
                                    "py": "def collect_messages(_):\n    prompt = inp.value_area.value\n    inp.value_area.value = ''\n    context.append({'role':'user', 'content':f'{prompt}'})\n    response = get_completion_from_messages({{context}})\n    context.append({'role':'assistant', 'content':f'{response}'})\n    panels.append(pn.Row('User:', pn.pane.Markdown(prompt, width=600))) \n    panels.append(pn.Row('Assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '#F6F6F6'})))"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "context"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Fill in the Blank"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Menu Prompt",
                                "problem": "<h2>Challenge</h2><p>Look at the provided pizza menu. If a user asks for 'pepperoni pizza', what follow-up question should the OrderBot ask to clarify the order?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What is the OrderBot's main goal?",
                                        "answers": [
                                            {
                                                "text": "Tell jokes",
                                                "value": 0
                                            },
                                            {
                                                "text": "Collect pizza orders",
                                                "value": 1
                                            },
                                            {
                                                "text": "Translate languages",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: OrderBot Goal"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "The OrderBot should clarify all options, {{toppings}}, and sizes.",
                                "precode": "The OrderBot should clarify all options, {{}}, and sizes."
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge: System Message",
                                "problem": "Given the provided menu, write a system message for the OrderBot that includes greeting the customer and explaining its purpose.",
                                "code_language": "text",
                                "precode": {"text": ""},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>What kind of information does the OrderBot need to collect from a customer to make sure it gets the order exactly right?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>If you were designing a chatbot for your favorite store, what would it sell, and what steps would it follow to take an order?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 7,
            "module_title": "Connecting to the Cloud: AI APIs with Python",
            "aim": "Introduce how to use Python to connect to and interact with real AI services via APIs.",
            "description": "Ready to make your own programs super smart? We'll learn how to 'talk' to big AI brains on the internet using something called an API! We'll use Python code to send our prompts and get back amazing completions.",
            "what_students_will_build": "Set up a safe Python environment, use Python to send prompts to an AI model, and receive AI-generated responses.",
            "concepts_learned": [
                "What an API is",
                "Python for web requests",
                "API keys and security",
                "programmatic prompting"
            ],
            "lessons": [
                {
                    "lesson_id": 7.1,
                    "lesson_title": "What's an API? Your Program's Secret Door to AI!",
                    "aim": "To understand what an API is and how it allows programs to communicate.",
                    "description": "An API is like a secret handshake that lets your program talk to other powerful programs on the internet, like AI services. We'll learn how your code can 'ask' an AI a question and get an answer back.",
                    "what_students_will_build": "Identify real-world examples of APIs and draw analogies.",
                    "concepts_learned": ["API definition", "request/response model", "real-world API examples"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "APIs: The Language of Apps",
                                "problem": "<h1>What is an API?</h1><p>An API (Application Programming Interface) is like a special waiter that lets different computer programs talk to each other. Your program (the customer) makes a request, and the API (the waiter) brings back a response from the service (the kitchen).</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "APIs Explained",
                                "video": "path/to/api_explainer_video.mp4"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What does API stand for?",
                                        "answers": [
                                            {
                                                "text": "Amazing Python Interface",
                                                "value": 0
                                            },
                                            {
                                                "text": "Application Programming Interface",
                                                "value": 1
                                            },
                                            {
                                                "text": "Artificial Program Intelligence",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: API Acronym"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "An API allows different computer {{programs}} to talk to each other.",
                                "precode": "An API allows different computer {{}} to talk to each other."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Real-World API",
                                "problem": "<h2>Challenge</h2><p>When you look up a map on your phone, you're probably using a mapping API. What kind of information do you think that API sends to your phone?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Analogy",
                                "problem": "<h2>Challenge</h2><p>Describe the API concept using your own analogy (e.g., a translator, a bridge).</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "You can only use APIs to connect to AI services.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: API Uses"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Brainstorm",
                                "problem": "<h2>Brainstorm</h2><p>Think of 3 apps or websites you use regularly. What kind of APIs might they be using behind the scenes?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it useful for an AI service to have an API instead of just being a website you type into?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's the most exciting possibility of your programs being able to 'talk' to other programs using APIs?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 7.2,
                    "lesson_title": "Getting Ready: Python & API Keys",
                    "aim": "To set up the Python environment and understand API key security.",
                    "description": "To use an AI's API, you need a special 'key' – like a secret password. We'll learn how to get this key and keep it safe in our Python programs. Safety first!",
                    "what_students_will_build": "Understand how to install Python libraries and securely manage API keys using environment variables.",
                    "concepts_learned": ["Python libraries (pip install)", "API keys", "security (.env files)", "environment variables"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Your AI Passport: Setting Up API Keys in Python",
                                "problem": "<h1>API Keys</h1><p>An API Key is a secret password that proves your program is allowed to access an AI service. It is very important to keep your key secret and secure!</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge: Installation",
                                "problem": "Explain the purpose of `!pip install openai` and `import openai` in Python for AI.",
                                "code_language": "text",
                                "precode": {"text": ""}
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 3,
                                "language": "python",
                                "precode": {
                                    "py": "import os\n\nopenai.api_key = os.{{getenv}}('OPENAI_API_KEY')"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "getenv"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Loading API Key"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "Why should you NOT directly type your API key into your Python code?",
                                        "answers": [
                                            {
                                                "text": "It's too long",
                                                "value": 0
                                            },
                                            {
                                                "text": "It's not secure",
                                                "value": 1
                                            },
                                            {
                                                "text": "It won't work",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: API Key Security"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 2,
                                "answer": "The dotenv library helps you load your API key securely from a {{.env}} file.",
                                "precode": "The dotenv library helps you load your API key securely from a {{}} file."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Security Scenario",
                                "problem": "<h2>Challenge</h2><p>Explain why sharing your API key publicly on the internet is a bad idea, similar to sharing your actual house key.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Reading",
                                "problem": "<h2>Challenge</h2><p>Look at a helper function that calls an AI API. If you see `temperature=0`, what does that mean for the AI's response?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "The openai library is used to talk to OpenAI's AI services.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 1
                                            },
                                            {
                                                "text": "False",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "0",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: OpenAI Library"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why do you think big AI companies make you use an API key instead of just letting anyone access their AI for free?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's one new thing you learned about keeping digital secrets safe?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 7.3,
                    "lesson_title": "Your First AI Call: Python Talks to the Cloud",
                    "aim": "To write a Python script that sends a prompt to an AI model and retrieves the response.",
                    "description": "Time to make Python talk to the AI cloud! We'll write real code that sends your question to an AI model and gets the answer back, all within your program.",
                    "what_students_will_build": "Write a Python script to make an API call to an AI model and print the response.",
                    "concepts_learned": ["Making API calls in Python", "handling API responses", "basic debugging of API calls"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Hello, AI! Sending Your First Python Prompt",
                                "problem": "<h1>Making the Call</h1><p>Now we'll write a Python script to send a prompt to an AI model in the cloud and print its response right in our program.</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 3,
                                "language": "python",
                                "precode": {
                                    "py": "response = openai.ChatCompletion.create(model=model, messages=messages, temperature=0)\nreturn response.choices[0].message[{{'content'}}]\n"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "'content'"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Get Response"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge: First Call",
                                "problem": "Write a Python script using the `get_completion` helper function to ask the AI: 'What is the biggest planet in our solar system?'. Print the response.",
                                "code_language": "python",
                                "precode": {"python": "# Your code here"},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What does the get_completion function help you do?",
                                        "answers": [
                                            {
                                                "text": "Install Python",
                                                "value": 0
                                            },
                                            {
                                                "text": "Send prompts to AI and get responses",
                                                "value": 1
                                            },
                                            {
                                                "text": "Draw pictures",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Helper Function"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "The AI's answer comes back as a {{string}} in your Python program.",
                                "precode": "The AI's answer comes back as a {{}} in your Python program."
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "New Prompt Challenge",
                                "problem": "Write a Python script using `get_completion` to ask the AI to 'Write a 2-sentence description of a unicorn.' Print the response.",
                                "code_language": "python",
                                "precode": {"python": "# Your code here"},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Error Prediction",
                                "problem": "<h2>Challenge</h2><p>If you forgot to `import openai`, what kind of error would you expect to see when you try to use `openai.ChatCompletion.create`?</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "You can only ask questions to the AI through its website, not through Python.",
                                        "answers": [
                                            {
                                                "text": "True",
                                                "value": 0
                                            },
                                            {
                                                "text": "False",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Access Methods"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Now that your Python code can talk to an AI, what's one simple but cool idea for a program you could build?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>How does sending a prompt through Python code feel different from typing into a chatbot's website?</p>"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 8,
            "module_title": "Your First AI-Powered Project: Smart Story Generator! (Capstone)",
            "aim": "Combine all learned skills to build a mini AI-powered application that demonstrates end-to-end development workflow.",
            "description": "It's time to put on your inventor's hat! You'll use everything you've learned to build your very own AI-powered project where you give it a few words, and it helps you write an amazing story!",
            "what_students_will_build": "Design and build a 'Smart Story Generator' where they provide a theme or starting sentence, and the AI helps expand it into a longer story.",
            "concepts_learned": [
                "Project planning",
                "integrating multiple AI concepts",
                "debugging Python code",
                "creative application of AI"
            ],
            "lessons": [
                {
                    "lesson_id": 8.1,
                    "lesson_title": "Project Planning: Designing Your Story Generator",
                    "aim": "To plan the structure and functionality of the AI Story Generator application.",
                    "description": "Every great creation starts with a blueprint. We'll sketch out how our 'Smart Story Generator' will work: what the user types in, what clever prompts we send to the AI, and how the amazing story will appear.",
                    "what_students_will_build": "Create a design document or flowchart for their Story Generator.",
                    "concepts_learned": ["Application design", "user input/output", "prompt design for creative tasks", "flowcharting"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Project Blueprint: Planning Your AI Story",
                                "problem": "<h1>Planning</h1><p>Every great invention starts with a plan. Before we write code, we'll map out how our 'Smart Story Generator' will work: what the user inputs, what prompts we send, and how we display the result.</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Planning a Small Software Project",
                                "video": "path/to/planning_video.mp4"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Brainstorm (Input)",
                                "problem": "<h2>Brainstorm</h2><p>What information will your Story Generator need from the user to start a story? (e.g., a character, a setting, a theme). List at least 3 ideas.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Brainstorm (Output)",
                                "problem": "<h2>Brainstorm</h2><p>What will the final output of your Story Generator look like? (e.g., a full story, a few paragraphs, a story summary).</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Prompt Idea",
                                "problem": "<h2>Challenge</h2><p>Write a draft prompt that your program will send to the AI to generate the story, incorporating ideas from previous modules (e.g., delimiters, specific instructions).</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What is the first step in building a new software project?",
                                        "answers": [
                                            {
                                                "text": "Write all the code",
                                                "value": 0
                                            },
                                            {
                                                "text": "Design and plan",
                                                "value": 1
                                            },
                                            {
                                                "text": "Ask the AI to build it for you",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: First Step"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "Project planning helps you understand the {{input}} and {{output}} of your application.",
                                "precode": "Project planning helps you understand the {{}} and {{}} of your application."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Flowchart (Conceptual)",
                                "problem": "<h2>Challenge</h2><p>Draw a simple flowchart showing: User gives input -> Program sends prompt to AI -> AI sends completion back -> Program displays story.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is it important to think about what the user will 'see' and 'do' in your app, even if you're building an AI tool?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What's the most exciting part of designing your own AI-powered tool?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 8.2,
                    "lesson_title": "Building Blocks: Coding Your Generator",
                    "aim": "To write the core Python code for the story generator, integrating AI API calls.",
                    "description": "Let's get coding! We'll write the Python script that takes the user's ideas, crafts a clever prompt, sends it to the AI, and then proudly displays the AI-generated story.",
                    "what_students_will_build": "Write Python functions to get user input, construct prompts, call the AI API, and display the story.",
                    "concepts_learned": ["Python functions", "f-strings for dynamic prompts", "API call integration", "console output"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Coding the Story: Python Meets AI",
                                "problem": "<h1>Coding Time</h1><p>Let's bring our plan to life! You'll write the Python magic that asks the user for their story ideas, builds the perfect prompt, sends it to the AI, and then shows the awesome story it creates.</p>"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 2,
                                "language": "python",
                                "precode": {
                                    "py": "user_idea = {{input}}('Enter a story idea: ')"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "input"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Get Input"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Code Challenge: Dynamic Prompt",
                                "problem": "Write Python code to create a prompt using an f-string that embeds the user's input (e.g., `f'Write a short story about {user_idea}'`).",
                                "code_language": "python",
                                "precode": {"python": "user_idea = \"a brave knight\"\n# Your code here\nmy_prompt = ...\nprint(my_prompt)"},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "code",
                            "action": "code_blank",
                            "metadata": {
                                "difficulty": 3,
                                "language": "python",
                                "precode": {
                                    "py": "story = {{get_completion}}(my_prompt)"
                                },
                                "solution": {
                                    "py": {
                                        "0": [
                                            "get_completion"
                                        ]
                                    }
                                },
                                "caption": "Code Challenge: Call AI"
                            }
                        },
                        {
                            "task_type": "code",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Code Challenge: Print Output",
                                "problem": "Write code to `print()` the AI-generated story to the console.",
                                "code_language": "python",
                                "precode": {"python": "story = \"Once upon a time...\"\n# Your code here"},
                                "verification_type": "ai_verification"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What Python function is used to get input from the user?",
                                        "answers": [
                                            {
                                                "text": "print()",
                                                "value": 0
                                            },
                                            {
                                                "text": "output()",
                                                "value": 0
                                            },
                                            {
                                                "text": "input()",
                                                "value": 1
                                            }
                                        ],
                                        "answer": "2",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: Input Function"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "An {{f}}-string is a helpful way to put variables directly into your prompt text.",
                                "precode": "An {{}}-string is a helpful way to put variables directly into your prompt text."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Debugging",
                                "problem": "<h2>Challenge</h2><p>Imagine your program isn't printing the story. List 2 common coding mistakes you'd check first.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>How does breaking down the coding into smaller steps (input, prompt, AI call, output) make building the whole project easier?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Reflection",
                                "problem": "<h2>Reflection</h2><p>What was the most challenging part of writing the code for your story generator, and how did you (or would you) overcome it?</p>"
                            }
                        }
                    ]
                },
                {
                    "lesson_id": 8.3,
                    "lesson_title": "Testing, Tweaking & Sharing Your Masterpiece!",
                    "aim": "To test the Story Generator, refine prompts for better stories, and prepare to share the project.",
                    "description": "Your AI Story Generator is ready for its grand debut! We'll become master testers, trying out different ideas, fixing any sneaky bugs, and tweaking our prompts to make the AI stories even more spectacular. Then, you can show off your creation!",
                    "what_students_will_build": "Thoroughly test their Story Generator, document any bugs or improvements, and refine their prompts for optimal story quality.",
                    "concepts_learned": ["Software testing", "debugging", "iterative refinement of prompts", "project presentation"],
                    "tasks": [
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Your AI's Grand Debut: Test, Tweak, and Share!",
                                "problem": "<h1>Testing and Refining</h1><p>Your story generator is alive! Now we become testers. We'll try it out, fix any bugs, and refine our prompts until the stories are amazing. Then, you'll get to share your creation!</p>"
                            }
                        },
                        {
                            "task_type": "ads",
                            "metadata": {
                                "difficulty": 1,
                                "caption": "Simple Debugging Strategies",
                                "video": "path/to/debugging_video.mp4"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Activity (Testing)",
                                "problem": "<h2>Activity</h2><p>Run your Smart Story Generator at least 5 times with different starting ideas. Save the prompts you used and the stories generated.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Bug Hunt",
                                "problem": "<h2>Challenge</h2><p>If your program gave an error, describe what the error message said and what you would do to try and fix it.</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Prompt Refinement",
                                "problem": "<h2>Challenge</h2><p>Review the stories your generator created. If some weren't great, how would you change your *prompt* to get better stories? (e.g., 'Make it funnier,' 'Add more characters.').</p>"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "quiz",
                            "metadata": {
                                "difficulty": 1,
                                "questions": [
                                    {
                                        "text": "What is a 'bug' in programming?",
                                        "answers": [
                                            {
                                                "text": "A small insect",
                                                "value": 0
                                            },
                                            {
                                                "text": "A mistake in the code",
                                                "value": 1
                                            },
                                            {
                                                "text": "A type of AI",
                                                "value": 0
                                            }
                                        ],
                                        "answer": "1",
                                        "type": "option"
                                    }
                                ],
                                "caption": "Quiz: What is a Bug?"
                            }
                        },
                        {
                            "task_type": "html",
                            "action": "blank",
                            "metadata": {
                                "difficulty": 1,
                                "answer": "Iterative refinement means continually {{improving}} your prompts and code based on testing.",
                                "precode": "Iterative refinement means continually {{}} your prompts and code based on testing."
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Feature Idea",
                                "problem": "<h2>Challenge</h2><p>What's one *new* small feature you would add to your Story Generator if you had more time (e.g., ask for story length, genre)?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 2,
                                "caption": "Discussion Prompt",
                                "problem": "<h2>Discussion</h2><p>Why is testing your code with many different inputs important, even if you think it's perfect?</p>"
                            }
                        },
                        {
                            "action": "text",
                            "task_type": "html",
                            "metadata": {
                                "difficulty": 3,
                                "caption": "Capstone Presentation",
                                "problem": "<h2>Capstone Presentation</h2><p>Prepare a short summary about your Smart Story Generator. Explain: What it does, how it uses AI, what was challenging, and what you're proud of. This project will serve as a portfolio piece!</p>"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
export default courseData
