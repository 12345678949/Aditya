// VisionCare AI - Main JavaScript Functions

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeEventListeners();
    updateSeverityDisplay();
});

// Conversation memory for context-aware responses
let conversationHistory = [];
let userProfile = {
    symptoms: [],
    concerns: [],
    previousQuestions: []
};

// Application initialization
function initializeApp() {
    console.log('VisionCare AI initialized');
    
    // Initialize mobile menu if needed
    initializeMobileMenu();
    
    // Initialize sample power progression chart
    initializeSamplePowerChart();
}

// Initialize all event listeners
function initializeEventListeners() {
    // Chat input enter key handler
    const userMessageInput = document.getElementById('userMessage');
    if (userMessageInput) {
        userMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Severity range slider
    const severityRange = document.getElementById('severityRange');
    if (severityRange) {
        severityRange.addEventListener('input', updateSeverityDisplay);
    }
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmission);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu initialization
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    // Implementation for mobile menu toggle
    console.log('Mobile menu toggled');
}

// AI Chatbot Functionality
function sendMessage() {
    const messageInput = document.getElementById('userMessage');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    messageInput.value = '';
    
    // Hide quick responses after first message
    hideQuickResponses();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message with AI (simulated) - varying response time for realism
    const responseTime = 1000 + Math.random() * 2000; // 1-3 seconds
    setTimeout(() => {
        processAIResponse(message);
    }, responseTime);
}

function sendQuickMessage(message) {
    const messageInput = document.getElementById('userMessage');
    messageInput.value = message;
    sendMessage();
}

function hideQuickResponses() {
    const quickResponses = document.getElementById('quickResponses');
    if (quickResponses) {
        quickResponses.style.display = 'none';
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message mb-4';
    
    const isUser = sender === 'user';
    const bgClass = isUser ? 'bg-blue-600 text-white ml-auto' : 'bg-blue-100 text-gray-800';
    
    messageDiv.innerHTML = `
        <div class="${bgClass} p-3 rounded-lg max-w-xs">
            <p class="text-sm ${isUser ? 'text-blue-100' : 'text-gray-600'} mb-1">${isUser ? 'You' : 'AI Assistant'}</p>
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'chat-message mb-4';
    typingDiv.innerHTML = `
        <div class="bg-blue-100 text-gray-800 p-3 rounded-lg max-w-xs">
            <p class="text-sm text-gray-600 mb-1">AI Assistant</p>
            <p class="flex items-center gap-2">
                <span class="loading"></span>
                Analyzing your symptoms...
            </p>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Enhanced AI Response Processing with Medical Knowledge Base
function processAIResponse(userMessage) {
    removeTypingIndicator();
    
    // Add to conversation history
    conversationHistory.push({
        type: 'user',
        message: userMessage,
        timestamp: new Date()
    });
    
    const analysisResult = comprehensiveMessageAnalysis(userMessage);
    
    // Update user profile based on conversation
    updateUserProfile(analysisResult);
    
    const response = generateIntelligentResponse(analysisResult, userMessage);
    
    // Add AI response to conversation history
    conversationHistory.push({
        type: 'ai',
        message: response,
        timestamp: new Date()
    });
    
    addMessageToChat('ai', response);
    
    // Show follow-up suggestions after response
    setTimeout(() => {
        showFollowUpSuggestions(analysisResult);
    }, 2000);
}

function updateUserProfile(analysisResult) {
    // Track symptoms mentioned
    if (analysisResult.symptoms.length > 0) {
        analysisResult.symptoms.forEach(symptom => {
            if (!userProfile.symptoms.some(s => s.type === symptom.type)) {
                userProfile.symptoms.push(symptom);
            }
        });
    }
    
    // Track concerns
    if (analysisResult.powerQuery.detected) {
        userProfile.concerns.push('eye_power');
    }
    if (analysisResult.treatmentQuery.detected) {
        userProfile.concerns.push('treatment_options');
    }
    
    // Track question patterns
    userProfile.previousQuestions.push(analysisResult.questionType);
}

function showFollowUpSuggestions(analysisResult) {
    const chatMessages = document.getElementById('chatMessages');
    const suggestions = generateFollowUpSuggestions(analysisResult);
    
    if (suggestions.length > 0) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'chat-message mb-4';
        suggestionDiv.innerHTML = `
            <div class="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p class="text-sm text-green-800 font-medium mb-2">💡 You might also want to know:</p>
                <div class="flex flex-wrap gap-2">
                    ${suggestions.map(suggestion => `
                        <button onclick="sendQuickMessage('${suggestion.message}')" 
                                class="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs hover:bg-green-300 transition duration-200">
                            ${suggestion.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        chatMessages.appendChild(suggestionDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function generateFollowUpSuggestions(analysisResult) {
    const suggestions = [];
    
    // Symptom-based follow-ups
    if (analysisResult.symptoms.length > 0) {
        suggestions.push({
            label: 'Prevention tips',
            message: 'How can I prevent this from happening again?'
        });
        
        if (!analysisResult.treatmentQuery.detected) {
            suggestions.push({
                label: 'Treatment options',
                message: 'What are the treatment options for this?'
            });
        }
    }
    
    // Power query follow-ups
    if (analysisResult.powerQuery.detected) {
        suggestions.push({
            label: 'Power analysis',
            message: 'Can you analyze my eye power numbers?'
        });
        
        suggestions.push({
            label: 'Surgery options',
            message: 'Should I consider eye surgery?'
        });
    }
    
    // General follow-ups
    if (!analysisResult.symptoms.length && !analysisResult.powerQuery.detected) {
        suggestions.push({
            label: 'Eye care tips',
            message: 'Give me some general eye care tips'
        });
        
        suggestions.push({
            label: 'Common problems',
            message: 'What are common eye problems?'
        });
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
}

// Comprehensive message analysis with medical intelligence
function comprehensiveMessageAnalysis(message) {
    const lowerMessage = message.toLowerCase();
    
    // Analyze symptoms with detailed medical knowledge
    const symptoms = analyzeDetailedSymptoms(message);
    
    // Detect eye power related queries
    const powerQuery = analyzePowerQueries(message);
    
    // Detect treatment questions
    const treatmentQuery = analyzeTreatmentQueries(message);
    
    // Detect urgency level
    const urgency = assessUrgencyLevel(message);
    
    // Detect question type
    const questionType = classifyQuestionType(message);
    
    return {
        symptoms: symptoms,
        powerQuery: powerQuery,
        treatmentQuery: treatmentQuery,
        urgency: urgency,
        questionType: questionType,
        originalMessage: message
    };
}

// Advanced symptom analysis with severity and context
function analyzeDetailedSymptoms(message) {
    const lowerMessage = message.toLowerCase();
    const detectedSymptoms = [];
    
    // Comprehensive symptom database with severity indicators
    const symptomDatabase = {
        'blurred_vision': {
            keywords: ['blurred', 'blur', 'fuzzy', 'unclear', 'hazy', 'cloudy', 'not sharp', 'cannot see clearly'],
            severity_keywords: {
                mild: ['slightly', 'little', 'sometimes'],
                moderate: ['often', 'usually', 'most times'],
                severe: ['very', 'extremely', 'always', 'constantly', 'terrible']
            }
        },
        'eye_pain': {
            keywords: ['pain', 'hurt', 'ache', 'sore', 'burning', 'stinging', 'stabbing', 'throbbing'],
            severity_keywords: {
                mild: ['slight', 'minor', 'little'],
                moderate: ['moderate', 'noticeable'],
                severe: ['severe', 'intense', 'excruciating', 'unbearable']
            }
        },
        'redness': {
            keywords: ['red', 'bloodshot', 'irritated', 'inflamed', 'pink'],
            severity_keywords: {
                mild: ['slightly red', 'little red'],
                moderate: ['red', 'bloodshot'],
                severe: ['very red', 'extremely red', 'bright red']
            }
        },
        'dry_eyes': {
            keywords: ['dry', 'gritty', 'sandy', 'scratchy', 'irritated', 'burning'],
            severity_keywords: {
                mild: ['sometimes dry', 'little dry'],
                moderate: ['dry', 'often dry'],
                severe: ['very dry', 'extremely dry', 'constantly dry']
            }
        },
        'floaters': {
            keywords: ['floater', 'spots', 'specks', 'dots', 'cobwebs', 'strings', 'moving spots'],
            severity_keywords: {
                mild: ['few', 'occasional'],
                moderate: ['several', 'many'],
                severe: ['lots of', 'many', 'suddenly appeared']
            }
        },
        'light_sensitivity': {
            keywords: ['bright', 'light sensitivity', 'photophobia', 'sensitive to light', 'hurts in light'],
            severity_keywords: {
                mild: ['slightly sensitive', 'little sensitive'],
                moderate: ['sensitive', 'bothers me'],
                severe: ['very sensitive', 'cannot tolerate light', 'extremely sensitive']
            }
        },
        'discharge': {
            keywords: ['discharge', 'pus', 'sticky', 'crusty', 'yellow', 'green', 'mucus'],
            severity_keywords: {
                mild: ['little', 'slight'],
                moderate: ['some', 'moderate'],
                severe: ['lots of', 'thick', 'heavy']
            }
        },
        'double_vision': {
            keywords: ['double', 'diplopia', 'seeing two', 'two images'],
            severity_keywords: {
                mild: ['occasionally', 'sometimes'],
                moderate: ['often', 'frequently'],
                severe: ['always', 'constantly']
            }
        },
        'headache': {
            keywords: ['headache', 'head pain', 'migraine', 'head hurts'],
            severity_keywords: {
                mild: ['slight headache', 'minor headache'],
                moderate: ['headache', 'head pain'],
                severe: ['severe headache', 'terrible headache', 'migraine']
            }
        },
        'itching': {
            keywords: ['itchy', 'itch', 'itching', 'want to rub'],
            severity_keywords: {
                mild: ['slightly itchy', 'little itch'],
                moderate: ['itchy', 'itching'],
                severe: ['very itchy', 'constantly itching', 'extremely itchy']
            }
        }
    };
    
    Object.keys(symptomDatabase).forEach(symptom => {
        const symptomData = symptomDatabase[symptom];
        
        // Check if any keywords match
        const hasSymptom = symptomData.keywords.some(keyword => lowerMessage.includes(keyword));
        
        if (hasSymptom) {
            // Determine severity
            let severity = 'moderate'; // default
            
            Object.keys(symptomData.severity_keywords).forEach(level => {
                if (symptomData.severity_keywords[level].some(keyword => lowerMessage.includes(keyword))) {
                    severity = level;
                }
            });
            
            detectedSymptoms.push({
                type: symptom,
                severity: severity,
                keywords_matched: symptomData.keywords.filter(keyword => lowerMessage.includes(keyword))
            });
        }
    });
    
    return detectedSymptoms;
}

// Analyze eye power related queries
function analyzePowerQueries(message) {
    const lowerMessage = message.toLowerCase();
    const powerKeywords = [
        'power', 'prescription', 'glasses', 'contacts', 'diopters', 'sphere', 'cylinder',
        'axis', 'myopia', 'hyperopia', 'astigmatism', 'nearsighted', 'farsighted',
        'minus power', 'plus power', 'eye number'
    ];
    
    const hasPowerQuery = powerKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasPowerQuery) {
        return {
            detected: true,
            type: determinePowerQueryType(lowerMessage),
            keywords: powerKeywords.filter(keyword => lowerMessage.includes(keyword))
        };
    }
    
    return { detected: false };
}

function determinePowerQueryType(message) {
    if (message.includes('increase') || message.includes('getting worse') || message.includes('progression')) {
        return 'progression_concern';
    }
    if (message.includes('new glasses') || message.includes('new prescription')) {
        return 'prescription_update';
    }
    if (message.includes('surgery') || message.includes('lasik') || message.includes('operation')) {
        return 'surgery_inquiry';
    }
    return 'general_power_question';
}

// Analyze treatment related queries
function analyzeTreatmentQueries(message) {
    const lowerMessage = message.toLowerCase();
    const treatmentKeywords = [
        'treatment', 'medicine', 'drops', 'surgery', 'cure', 'heal', 'fix',
        'what should i do', 'how to treat', 'medication', 'therapy'
    ];
    
    const hasTreatmentQuery = treatmentKeywords.some(keyword => lowerMessage.includes(keyword));
    
    return {
        detected: hasTreatmentQuery,
        keywords: treatmentKeywords.filter(keyword => lowerMessage.includes(keyword))
    };
}

// Assess urgency level based on keywords and symptoms
function assessUrgencyLevel(message) {
    const lowerMessage = message.toLowerCase();
    
    // High urgency indicators
    const emergencyKeywords = [
        'sudden', 'emergency', 'urgent', 'immediate', 'severe pain', 'cannot see',
        'flashes', 'curtain', 'shadow', 'loss of vision', 'trauma', 'injury'
    ];
    
    // Medium urgency indicators
    const moderateKeywords = [
        'getting worse', 'persistent', 'several days', 'week', 'bothering me'
    ];
    
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return 'high';
    }
    
    if (moderateKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return 'medium';
    }
    
    return 'low';
}

// Classify the type of question
function classifyQuestionType(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what') || lowerMessage.includes('explain')) {
        return 'information_seeking';
    }
    if (lowerMessage.includes('how') || lowerMessage.includes('can i')) {
        return 'how_to_question';
    }
    if (lowerMessage.includes('should i') || lowerMessage.includes('do i need')) {
        return 'advice_seeking';
    }
    if (lowerMessage.includes('?')) {
        return 'general_question';
    }
    
    return 'statement_description';
}

// Generate intelligent, contextual responses
function generateIntelligentResponse(analysis, originalMessage) {
    const { symptoms, powerQuery, treatmentQuery, urgency, questionType } = analysis;
    
    let response = "";
    
    // Handle urgency first
    if (urgency === 'high') {
        response += "⚠️ **URGENT ATTENTION NEEDED** ⚠️\n\n";
        response += "Based on your description, this may require immediate medical attention. Please consider:\n";
        response += "• Visit an emergency room or urgent care immediately\n";
        response += "• Call an ophthalmologist's emergency line\n";
        response += "• Do not delay seeking professional care\n\n";
    }
    
    // Handle symptoms with detailed medical advice
    if (symptoms.length > 0) {
        response += generateSymptomSpecificResponse(symptoms);
    }
    
    // Handle eye power queries
    if (powerQuery.detected) {
        response += generatePowerQueryResponse(powerQuery);
    }
    
    // Handle treatment queries
    if (treatmentQuery.detected) {
        response += generateTreatmentResponse(symptoms);
    }
    
    // If no specific symptoms detected, provide general guidance
    if (symptoms.length === 0 && !powerQuery.detected && !treatmentQuery.detected) {
        response += generateGeneralResponse(questionType, originalMessage);
    }
    
    // Add appropriate closing based on urgency
    response += generateResponseClosing(urgency);
    
    return response;
}

function generateSymptomSpecificResponse(symptoms) {
    let response = "**Symptom Analysis & Recommendations:**\n\n";
    
    symptoms.forEach(symptom => {
        const symptomInfo = getDetailedSymptomInfo(symptom.type, symptom.severity);
        response += `🔹 **${symptomInfo.name}** (${symptom.severity} severity):\n`;
        response += `${symptomInfo.description}\n\n`;
        response += `**Immediate Actions:**\n`;
        symptomInfo.actions.forEach(action => {
            response += `• ${action}\n`;
        });
        response += `\n**When to See a Doctor:** ${symptomInfo.when_to_see_doctor}\n\n`;
    });
    
    return response;
}

function getDetailedSymptomInfo(symptomType, severity) {
    const symptomDatabase = {
        'blurred_vision': {
            name: 'Blurred Vision',
            description: 'Difficulty seeing clearly, objects appear out of focus or hazy.',
            actions: {
                mild: [
                    'Rest your eyes regularly (20-20-20 rule)',
                    'Check if you need updated glasses prescription',
                    'Ensure proper lighting when reading'
                ],
                moderate: [
                    'Schedule an eye examination within 1-2 weeks',
                    'Avoid driving if vision is significantly affected',
                    'Document when blurriness occurs most'
                ],
                severe: [
                    'Seek immediate eye care evaluation',
                    'Avoid activities requiring clear vision',
                    'Consider emergency care if sudden onset'
                ]
            },
            when_to_see_doctor: {
                mild: 'Within 2-4 weeks if persistent',
                moderate: 'Within 1-2 weeks',
                severe: 'Immediately, especially if sudden onset'
            }
        },
        'eye_pain': {
            name: 'Eye Pain',
            description: 'Discomfort, aching, or sharp pain in or around the eye.',
            actions: {
                mild: [
                    'Apply cool compress for 10-15 minutes',
                    'Take over-the-counter pain relief if needed',
                    'Avoid rubbing the eye'
                ],
                moderate: [
                    'Use preservative-free artificial tears',
                    'Schedule eye appointment within days',
                    'Monitor for worsening symptoms'
                ],
                severe: [
                    'Seek immediate medical attention',
                    'Do not apply pressure to the eye',
                    'Note any associated symptoms'
                ]
            },
            when_to_see_doctor: {
                mild: 'If pain persists more than 24-48 hours',
                moderate: 'Within 24-48 hours',
                severe: 'Immediately'
            }
        },
        'dry_eyes': {
            name: 'Dry Eyes',
            description: 'Insufficient tear production or poor tear quality causing discomfort.',
            actions: {
                mild: [
                    'Use preservative-free artificial tears 4-6 times daily',
                    'Take breaks from screen time',
                    'Use a humidifier in dry environments'
                ],
                moderate: [
                    'Increase frequency of artificial tears',
                    'Consider prescription eye drops',
                    'Evaluate medications that may cause dryness'
                ],
                severe: [
                    'Consult eye care professional for prescription treatments',
                    'Consider punctal plugs or other interventions',
                    'Rule out underlying autoimmune conditions'
                ]
            },
            when_to_see_doctor: {
                mild: 'If not improved with over-the-counter treatments in 2 weeks',
                moderate: 'Within 1-2 weeks',
                severe: 'Within a few days'
            }
        },
        'redness': {
            name: 'Eye Redness',
            description: 'Blood vessels in the eye become dilated, causing red appearance.',
            actions: {
                mild: [
                    'Use cool compress to reduce inflammation',
                    'Avoid eye makeup temporarily',
                    'Identify and avoid potential allergens'
                ],
                moderate: [
                    'Use artificial tears to flush irritants',
                    'Consider antihistamine drops if allergic',
                    'Monitor for discharge or pain'
                ],
                severe: [
                    'Seek medical evaluation promptly',
                    'Do not use whitening eye drops',
                    'Note any vision changes or pain'
                ]
            },
            when_to_see_doctor: {
                mild: 'If persists more than 2-3 days',
                moderate: 'Within 1-2 days',
                severe: 'Same day or immediately if with pain'
            }
        },
        'floaters': {
            name: 'Eye Floaters',
            description: 'Small specks or clouds moving in your field of vision.',
            actions: {
                mild: [
                    'Generally no treatment needed for occasional floaters',
                    'Move eyes up and down to shift floaters',
                    'Monitor for any sudden changes'
                ],
                moderate: [
                    'Schedule routine eye examination',
                    'Document number and frequency',
                    'Note any associated flashing lights'
                ],
                severe: [
                    'Seek immediate eye care evaluation',
                    'Especially urgent if with flashing lights',
                    'May indicate retinal detachment'
                ]
            },
            when_to_see_doctor: {
                mild: 'During next routine eye exam',
                moderate: 'Within 1-2 weeks',
                severe: 'Immediately, especially with flashes or curtain vision'
            }
        }
    };
    
    const info = symptomDatabase[symptomType];
    if (!info) return { name: 'Unknown Symptom', description: '', actions: [], when_to_see_doctor: '' };
    
    return {
        name: info.name,
        description: info.description,
        actions: info.actions[severity] || info.actions.moderate,
        when_to_see_doctor: info.when_to_see_doctor[severity] || info.when_to_see_doctor.moderate
    };
}

function generatePowerQueryResponse(powerQuery) {
    let response = "**Eye Power & Prescription Information:**\n\n";
    
    switch (powerQuery.type) {
        case 'progression_concern':
            response += "📈 **Power Progression Concerns:**\n";
            response += "• Myopia progression is common, especially in children and young adults\n";
            response += "• Annual eye exams help monitor changes\n";
            response += "• Consider myopia control strategies if progressing rapidly\n";
            response += "• Lifestyle factors: reduce near work, increase outdoor time\n\n";
            break;
        case 'prescription_update':
            response += "👓 **New Prescription Guidelines:**\n";
            response += "• Get comprehensive eye exam every 1-2 years\n";
            response += "• Bring current glasses for comparison\n";
            response += "• Consider lens options: anti-reflective, blue light filtering\n";
            response += "• Discuss contact lens options if interested\n\n";
            break;
        case 'surgery_inquiry':
            response += "⚕️ **Refractive Surgery Information:**\n";
            response += "• LASIK/PRK suitable for stable prescriptions (1+ year)\n";
            response += "• Age considerations: typically 18+ years\n";
            response += "• Comprehensive evaluation needed for candidacy\n";
            response += "• Consider risks, benefits, and alternatives\n\n";
            break;
        default:
            response += "🔍 **General Power Information:**\n";
            response += "• Use our Eye Power Analysis tool for detailed assessment\n";
            response += "• Myopia (nearsightedness): negative power values\n";
            response += "• Hyperopia (farsightedness): positive power values\n";
            response += "• Astigmatism: cylinder values for corneal irregularity\n\n";
    }
    
    return response;
}

function generateTreatmentResponse(symptoms) {
    let response = "**Treatment Options & Recommendations:**\n\n";
    
    if (symptoms.length > 0) {
        response += "Based on your symptoms, here are treatment approaches:\n\n";
        
        symptoms.forEach(symptom => {
            const treatments = getTreatmentOptions(symptom.type, symptom.severity);
            response += `**For ${symptom.type.replace('_', ' ')}:**\n`;
            treatments.forEach(treatment => {
                response += `• ${treatment}\n`;
            });
            response += "\n";
        });
    } else {
        response += "• **Conservative treatments**: Often start with least invasive options\n";
        response += "• **Medications**: Prescription eye drops for specific conditions\n";
        response += "• **Lifestyle modifications**: Often very effective for prevention\n";
        response += "• **Surgical options**: When conservative treatments insufficient\n\n";
    }
    
    return response;
}

function getTreatmentOptions(symptomType, severity) {
    const treatmentDatabase = {
        'dry_eyes': [
            'Preservative-free artificial tears',
            'Prescription anti-inflammatory drops',
            'Omega-3 fatty acid supplements',
            'Punctal plugs for severe cases',
            'Lifestyle modifications (humidity, screen breaks)'
        ],
        'eye_pain': [
            'Cool compresses',
            'Over-the-counter pain relief',
            'Prescription anti-inflammatory drops',
            'Treatment of underlying cause',
            'Rest and eye protection'
        ],
        'redness': [
            'Identify and avoid irritants',
            'Antihistamine drops for allergies',
            'Cool compresses',
            'Artificial tears for lubrication',
            'Prescription drops if infectious'
        ],
        'blurred_vision': [
            'Updated prescription glasses/contacts',
            'Treatment of underlying conditions',
            'Surgical correction (LASIK, cataract surgery)',
            'Vision therapy if appropriate',
            'Regular eye examinations'
        ]
    };
    
    return treatmentDatabase[symptomType] || ['Consult eye care professional for specific treatment recommendations'];
}

function generateGeneralResponse(questionType, originalMessage) {
    let response = "";
    const lowerMessage = originalMessage.toLowerCase();
    
    // Handle greetings and common phrases
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response += "👋 Hello! Great to meet you! I'm here to help with all your eye care questions.\n\n";
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        response += "😊 You're very welcome! I'm glad I could help.\n\n";
    } else if (lowerMessage.includes('help')) {
        response += "🤝 Absolutely! I'm here to help you with your eye health concerns.\n\n";
    }
    
    // Handle specific information requests
    if (lowerMessage.includes('common') && lowerMessage.includes('problem')) {
        response += generateCommonEyeProblemsInfo();
        return response;
    }
    
    if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('care')) {
        response += generateEyeCareTips();
        return response;
    }
    
    if (lowerMessage.includes('surgery') || lowerMessage.includes('operation')) {
        response += generateSurgeryOverview();
        return response;
    }
    
    switch (questionType) {
        case 'information_seeking':
            response += "**📚 Eye Health Information Center:**\n\n";
            response += "I have extensive knowledge about eye health! Here's what I can help with:\n\n";
            response += "🔍 **Common Conditions**: Myopia, hyperopia, astigmatism, dry eyes, glaucoma, cataracts\n";
            response += "🛡️ **Preventive Care**: Regular exams, UV protection, proper nutrition, lifestyle tips\n";
            response += "💊 **Treatment Options**: Medications, therapies, surgical procedures\n";
            response += "👓 **Vision Correction**: Glasses, contacts, refractive surgery\n\n";
            response += "*What specific topic interests you most?*\n\n";
            break;
            
        case 'how_to_question':
            response += "**🎯 Practical Eye Care Guidance:**\n\n";
            response += "Here's how to maintain excellent eye health:\n\n";
            response += "**Daily Habits:**\n";
            response += "• Follow the 20-20-20 rule (every 20 min, look 20 feet away for 20 seconds)\n";
            response += "• Use proper lighting when reading or working\n";
            response += "• Wear 100% UV-blocking sunglasses outdoors\n";
            response += "• Maintain proper screen distance (arm's length)\n\n";
            response += "**Nutrition for Eyes:**\n";
            response += "• Eat leafy greens (lutein, zeaxanthin)\n";
            response += "• Include omega-3 rich fish\n";
            response += "• Consume vitamin C and E rich foods\n";
            response += "• Stay hydrated for tear production\n\n";
            break;
            
        case 'advice_seeking':
            response += "**🩺 Professional Medical Guidance:**\n\n";
            response += "I can provide educational information, but for medical decisions, I recommend:\n\n";
            response += "**Immediate Steps:**\n";
            response += "• Use our comprehensive symptom analyzer\n";
            response += "• Try our eye power analysis tool\n";
            response += "• Document your symptoms with our guidance\n\n";
            response += "**Professional Care:**\n";
            response += "• Schedule comprehensive eye examination\n";
            response += "• Bring list of current medications\n";
            response += "• Prepare questions about your specific concerns\n\n";
            break;
            
        default:
            response += "**🌟 Welcome to Your Personal Eye Care Assistant!**\n\n";
            response += "I'm equipped with comprehensive medical knowledge to help you understand:\n\n";
            response += "👁️ **Symptom Analysis**: Tell me what you're experiencing - pain, blurred vision, redness, etc.\n";
            response += "🔢 **Eye Power Consultation**: Questions about prescriptions, progression, surgery options\n";
            response += "💊 **Treatment Guidance**: Learn about medications, therapies, and procedures\n";
            response += "📋 **Health Maintenance**: Prevention tips and lifestyle recommendations\n\n";
            response += "**💬 Try saying things like:**\n";
            response += "• \"My eyes feel dry and gritty\"\n";
            response += "• \"Is my eye power getting worse?\"\n";
            response += "• \"What are the best eye drops for me?\"\n";
            response += "• \"Should I consider LASIK surgery?\"\n\n";
            response += "*What's on your mind about your eye health today?* 🤔\n\n";
    }
    
    return response;
}

function generateCommonEyeProblemsInfo() {
    return `**👁️ Most Common Eye Problems & What You Should Know:**

**1. Refractive Errors (80% of vision problems)**
• **Myopia (Nearsightedness)**: Can't see far objects clearly
• **Hyperopia (Farsightedness)**: Can't see near objects clearly  
• **Astigmatism**: Blurred vision due to irregular cornea shape
• **Presbyopia**: Age-related near vision difficulty

**2. Dry Eye Disease**
• Affects 16 million Americans
• Symptoms: burning, gritty feeling, redness
• Causes: aging, medications, environment, screen time

**3. Digital Eye Strain**
• 90% of computer users experience symptoms
• Symptoms: tired eyes, headaches, blurred vision
• Prevention: 20-20-20 rule, proper lighting, regular breaks

**4. Age-Related Issues**
• **Cataracts**: Clouding of eye lens (affects 50% over 80)
• **Glaucoma**: "Silent thief of sight" - regular screening crucial
• **Macular Degeneration**: Leading cause of blindness over 50

**5. Allergic Conjunctivitis**
• Red, itchy, watery eyes
• Seasonal or year-round triggers
• Treatment: avoid allergens, antihistamine drops

*Which of these concerns you most? I can provide detailed information and recommendations!* 🎯`;
}

function generateEyeCareTips() {
    return `**✨ Expert Eye Care Tips for Optimal Vision Health:**

**🌅 Daily Habits That Make a Difference:**
• **Morning**: Use preservative-free tears if eyes feel dry upon waking
• **Work**: Position screen 20-26 inches away, slightly below eye level
• **Breaks**: Every hour, close eyes for 30 seconds to rewet naturally
• **Evening**: Remove makeup gently, use warm compress if tired

**🥗 Nutrition for Stronger Eyes:**
• **Lutein & Zeaxanthin**: Kale, spinach, corn, egg yolks
• **Omega-3 Fatty Acids**: Salmon, walnuts, flaxseed
• **Vitamin C**: Citrus fruits, strawberries, bell peppers
• **Vitamin E**: Almonds, sunflower seeds, avocado
• **Zinc**: Oysters, beef, pumpkin seeds

**🛡️ Protection Strategies:**
• **UV Protection**: Wear sunglasses year-round (even cloudy days!)
• **Safety Glasses**: During sports, yard work, home projects
• **Blue Light**: Consider blue light glasses for extended screen use
• **Sleep**: 7-9 hours for eye tissue repair and moisture restoration

**📱 Digital Device Guidelines:**
• **Screen Brightness**: Match surrounding lighting (not too bright/dim)
• **Font Size**: Increase to reduce squinting and strain
• **Contrast**: High contrast reduces eye muscle fatigue
• **Positioning**: Top of screen at or below eye level

**🔍 When to Seek Professional Care:**
• **Annual Exams**: Even without symptoms (prevention is key!)
• **New Symptoms**: Any sudden changes in vision
• **Family History**: More frequent checks if genetic risk factors

*Want specific advice for any of these areas? Just ask!* 🤗`;
}

function generateSurgeryOverview() {
    return `**⚕️ Eye Surgery Options - Complete Overview:**

**👓 Refractive Surgery (Vision Correction):**
• **LASIK**: Most popular, quick recovery, reshapes cornea with laser
• **PRK**: Alternative to LASIK, longer healing, good for thin corneas
• **SMILE**: Newer technique, smaller incision, faster healing
• **ICL**: Implantable lens, reversible, good for high prescriptions

**💧 Cataract Surgery:**
• **Procedure**: Replace cloudy lens with clear artificial lens
• **Success Rate**: 95%+ successful outcomes
• **Recovery**: Most return to normal activities in 1-2 weeks
• **Technology**: Premium lenses can correct astigmatism too

**👁️ Glaucoma Surgery:**
• **Trabeculectomy**: Create new drainage pathway for eye fluid
• **Tube Shunts**: Implant drainage device
• **MIGS**: Minimally invasive procedures with faster recovery
• **Laser Treatments**: SLT, ALT for pressure reduction

**🎯 Retinal Surgery:**
• **Vitrectomy**: Remove gel from eye center for retinal repair
• **Retinal Detachment**: Emergency procedure to restore vision
• **Macular Hole**: Repair central vision problems
• **Diabetic Retinopathy**: Laser or injection treatments

**✅ Surgery Candidacy Factors:**
• **Stable prescription** (1+ year for refractive surgery)
• **Age considerations** (18+ for most procedures)
• **Overall eye health** (no active infections or diseases)
• **Realistic expectations** about outcomes and risks

**💰 Investment & Insurance:**
• **Refractive Surgery**: Usually not covered, $2000-4000+ per eye
• **Medical Procedures**: Often covered when medically necessary
• **Financing Options**: Many practices offer payment plans

*Considering surgery? I can help you understand if you might be a good candidate!* 🎯`;
}

function generateResponseClosing(urgency) {
    let closing = "";
    
    switch (urgency) {
        case 'high':
            closing += "**⚠️ Remember: This is not a substitute for professional medical care. Please seek immediate attention for urgent symptoms.**\n";
            break;
        case 'medium':
            closing += "**💡 Recommendation: Schedule an appointment with an eye care professional for proper evaluation and treatment.**\n";
            break;
        default:
            closing += "**💡 Tip: Regular eye exams help maintain optimal vision health. Feel free to ask me more questions!**\n";
    }
    
    closing += "\n*Would you like to use our Eye Power Analysis tool or learn about specific treatments?*";
    
    return closing;
}

// Symptom Checker Functionality
function analyzeSymptoms() {
    const primarySymptom = document.getElementById('primarySymptom').value;
    const duration = document.getElementById('symptomDuration').value;
    const severity = document.getElementById('severityRange').value;
    
    if (!primarySymptom || !duration) {
        alert('Please select both primary symptom and duration.');
        return;
    }
    
    const analysisResults = document.getElementById('analysisResults');
    const analysisContent = document.getElementById('analysisContent');
    
    // Generate analysis based on inputs
    const analysis = generateSymptomAnalysis(primarySymptom, duration, severity);
    
    analysisContent.innerHTML = analysis;
    analysisResults.classList.remove('hidden');
    analysisResults.scrollIntoView({ behavior: 'smooth' });
}

function generateSymptomAnalysis(symptom, duration, severity) {
    const severityLevel = severity <= 3 ? 'Low' : severity <= 6 ? 'Moderate' : 'High';
    const severityClass = severity <= 3 ? 'success' : severity <= 6 ? 'warning' : 'danger';
    
    let analysis = `
        <div class="analysis-card">
            <h5 class="font-semibold text-lg mb-4 flex items-center">
                <i class="fas fa-microscope mr-2 text-blue-600"></i>Symptom Analysis Results
            </h5>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h6 class="font-medium text-gray-800 mb-3">Assessment Summary</h6>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span>Primary Symptom:</span>
                            <span class="font-medium">${getSymptomDisplayName(symptom)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Duration:</span>
                            <span class="font-medium">${getDurationDisplayName(duration)}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Severity Level:</span>
                            <span class="status-badge status-${severityClass.toLowerCase()}">${severityLevel}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h6 class="font-medium text-gray-800 mb-3">Risk Assessment</h6>
                    <div class="risk-meter">
                        <div class="risk-fill risk-${severityClass.toLowerCase()}" style="width: ${(severity / 10) * 100}%"></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">Severity: ${severity}/10</p>
                </div>
            </div>
        </div>
    `;
    
    // Add specific recommendations based on symptom
    analysis += getSymptomRecommendations(symptom, duration, severity);
    
    // Add treatment timeline
    analysis += getTreatmentTimeline(symptom, severity);
    
    return analysis;
}

function getSymptomDisplayName(symptom) {
    const displayNames = {
        'blurred_vision': 'Blurred Vision',
        'eye_pain': 'Eye Pain',
        'redness': 'Eye Redness',
        'dry_eyes': 'Dry Eyes',
        'floaters': 'Floaters',
        'light_sensitivity': 'Light Sensitivity',
        'discharge': 'Eye Discharge',
        'double_vision': 'Double Vision'
    };
    return displayNames[symptom] || symptom;
}

function getDurationDisplayName(duration) {
    const displayNames = {
        'hours': 'Few Hours',
        'days': 'Few Days',
        'weeks': 'Few Weeks',
        'months': 'Few Months',
        'chronic': 'Chronic/Ongoing'
    };
    return displayNames[duration] || duration;
}

function getSymptomRecommendations(symptom, duration, severity) {
    let recommendations = `
        <div class="recommendation">
            <h6 class="font-medium text-gray-800 mb-3 flex items-center">
                <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>Personalized Recommendations
            </h6>
    `;
    
    // Severity-based urgency
    if (severity >= 8) {
        recommendations += `
            <div class="danger-card mb-4">
                <div class="flex items-center mb-2">
                    <span class="recommendation-priority priority-high">High Priority</span>
                </div>
                <p class="font-medium text-red-800">Seek immediate medical attention</p>
                <p class="text-red-700">Your symptoms indicate a potentially serious condition that requires urgent care.</p>
            </div>
        `;
    } else if (severity >= 5) {
        recommendations += `
            <div class="warning-card mb-4">
                <div class="flex items-center mb-2">
                    <span class="recommendation-priority priority-medium">Medium Priority</span>
                </div>
                <p class="font-medium text-yellow-800">Schedule an appointment within 1-2 days</p>
                <p class="text-yellow-700">Your symptoms should be evaluated by an eye care professional soon.</p>
            </div>
        `;
    } else {
        recommendations += `
            <div class="diagnosis-card mb-4">
                <div class="flex items-center mb-2">
                    <span class="recommendation-priority priority-low">Low Priority</span>
                </div>
                <p class="font-medium text-green-800">Monitor symptoms and schedule routine check-up</p>
                <p class="text-green-700">Your symptoms are mild but should still be monitored.</p>
            </div>
        `;
    }
    
    // Symptom-specific recommendations
    switch(symptom) {
        case 'blurred_vision':
            recommendations += `
                <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                        <i class="fas fa-eye text-blue-500 mt-1"></i>
                        <span>Consider comprehensive eye examination to check for refractive errors or cataracts</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-glasses text-blue-500 mt-1"></i>
                        <span>Update prescription glasses if you wear them</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-desktop text-blue-500 mt-1"></i>
                        <span>Take regular breaks from digital screens (20-20-20 rule)</span>
                    </li>
                </ul>
            `;
            break;
        case 'dry_eyes':
            recommendations += `
                <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                        <i class="fas fa-tint text-blue-500 mt-1"></i>
                        <span>Use preservative-free artificial tears 4-6 times daily</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-wind text-blue-500 mt-1"></i>
                        <span>Avoid direct air flow from fans or AC vents</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-thermometer-half text-blue-500 mt-1"></i>
                        <span>Use a humidifier to add moisture to the air</span>
                    </li>
                </ul>
            `;
            break;
        case 'eye_pain':
            recommendations += `
                <ul class="space-y-2 text-sm">
                    <li class="flex items-start gap-2">
                        <i class="fas fa-user-md text-blue-500 mt-1"></i>
                        <span>Seek immediate medical evaluation for severe or persistent pain</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-thermometer text-blue-500 mt-1"></i>
                        <span>Apply cool compress for 10-15 minutes to reduce inflammation</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <i class="fas fa-ban text-blue-500 mt-1"></i>
                        <span>Avoid rubbing or touching the affected eye</span>
                    </li>
                </ul>
            `;
            break;
    }
    
    recommendations += '</div>';
    return recommendations;
}

function getTreatmentTimeline(symptom, severity) {
    return `
        <div class="recommendation">
            <h6 class="font-medium text-gray-800 mb-4 flex items-center">
                <i class="fas fa-clock mr-2 text-purple-500"></i>Expected Treatment Timeline
            </h6>
            <div class="treatment-timeline">
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="ml-4">
                        <h7 class="font-medium text-gray-800">Initial Assessment</h7>
                        <p class="text-sm text-gray-600">Comprehensive eye examination and diagnosis</p>
                        <span class="text-xs text-blue-600">Day 1-3</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot" style="background: #10b981;"></div>
                    <div class="ml-4">
                        <h7 class="font-medium text-gray-800">Treatment Initiation</h7>
                        <p class="text-sm text-gray-600">Begin prescribed medications or therapy</p>
                        <span class="text-xs text-green-600">Day 3-7</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot" style="background: #f59e0b;"></div>
                    <div class="ml-4">
                        <h7 class="font-medium text-gray-800">Progress Evaluation</h7>
                        <p class="text-sm text-gray-600">Follow-up to assess treatment effectiveness</p>
                        <span class="text-xs text-yellow-600">Week 2-4</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Severity slider update
function updateSeverityDisplay() {
    const severityRange = document.getElementById('severityRange');
    const severityValue = document.getElementById('severityValue');
    
    if (severityRange && severityValue) {
        severityValue.textContent = severityRange.value;
    }
}

// Treatment Details Functions
function showTreatmentDetails(type) {
    const treatments = {
        'non-surgical': {
            title: 'Non-Surgical Treatments',
            icon: 'fas fa-eye-dropper',
            color: 'blue',
            treatments: [
                {
                    name: 'Prescription Eye Drops',
                    description: 'Medicated drops for various conditions including glaucoma, dry eyes, and infections.',
                    effectiveness: '85-95%',
                    duration: '2-8 weeks'
                },
                {
                    name: 'Vision Therapy',
                    description: 'Structured program to improve visual skills and processing.',
                    effectiveness: '70-85%',
                    duration: '3-6 months'
                },
                {
                    name: 'Corrective Lenses',
                    description: 'Glasses or contact lenses to correct refractive errors.',
                    effectiveness: '95-99%',
                    duration: 'Ongoing'
                }
            ]
        },
        'minimally-invasive': {
            title: 'Minimally Invasive Procedures',
            icon: 'fas fa-procedures',
            color: 'green',
            treatments: [
                {
                    name: 'Laser Photocoagulation',
                    description: 'Laser treatment for diabetic retinopathy and retinal tears.',
                    effectiveness: '80-90%',
                    duration: '1-2 sessions'
                },
                {
                    name: 'Anti-VEGF Injections',
                    description: 'Injections to treat macular degeneration and diabetic eye disease.',
                    effectiveness: '75-85%',
                    duration: '6-12 months'
                },
                {
                    name: 'IPL Therapy',
                    description: 'Intense pulsed light therapy for dry eye disease.',
                    effectiveness: '70-80%',
                    duration: '3-4 sessions'
                }
            ]
        },
        'surgical': {
            title: 'Surgical Options',
            icon: 'fas fa-user-md',
            color: 'red',
            treatments: [
                {
                    name: 'Cataract Surgery',
                    description: 'Removal of cloudy lens and replacement with artificial intraocular lens.',
                    effectiveness: '95-98%',
                    duration: '30-45 minutes'
                },
                {
                    name: 'LASIK/PRK',
                    description: 'Laser vision correction for nearsightedness, farsightedness, and astigmatism.',
                    effectiveness: '90-95%',
                    duration: '15-30 minutes'
                },
                {
                    name: 'Vitrectomy',
                    description: 'Surgical removal of vitreous gel to treat retinal conditions.',
                    effectiveness: '80-90%',
                    duration: '1-3 hours'
                }
            ]
        }
    };
    
    const treatment = treatments[type];
    if (!treatment) return;
    
    // Create modal or detailed view
    showTreatmentModal(treatment);
}

function showTreatmentModal(treatment) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                        <i class="${treatment.icon} mr-3 text-${treatment.color}-600"></i>
                        ${treatment.title}
                    </h3>
                    <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="grid gap-6">
                    ${treatment.treatments.map(t => `
                        <div class="border rounded-lg p-6 hover:shadow-md transition duration-300">
                            <div class="flex justify-between items-start mb-4">
                                <h4 class="text-xl font-semibold text-gray-800">${t.name}</h4>
                                <span class="bg-${treatment.color}-100 text-${treatment.color}-800 px-3 py-1 rounded-full text-sm font-medium">
                                    ${t.effectiveness} Success Rate
                                </span>
                            </div>
                            <p class="text-gray-600 mb-4">${t.description}</p>
                            <div class="flex justify-between text-sm text-gray-500">
                                <span><i class="fas fa-clock mr-1"></i>Duration: ${t.duration}</span>
                                <span><i class="fas fa-check-circle mr-1"></i>Effectiveness: ${t.effectiveness}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-6 pt-6 border-t">
                    <button onclick="closeModal()" class="bg-${treatment.color}-600 text-white px-6 py-3 rounded-lg hover:bg-${treatment.color}-700 transition duration-300">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener to close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
    }
}

// --- Eye Drop Helper Functionality --- //

function recommendEyeDrops() {
    // Get the number from the input box
    const eyePower = document.getElementById('eyePowerInput').value;
    
    // Find the div where we will show the result
    const resultDiv = document.getElementById('eyeDropResult');

    // A very important message!
    let importantMessage = "<p class='text-sm text-red-600 mt-4'>Remember, always ask a real doctor! This is just a AI consultant guide which maybe incorrect guide.</p>";

    // If the user didn't type anything
    if (eyePower === "") {
        resultDiv.innerHTML = "Please enter your eye power number first! 😊";
        return;
    }

    // Let's decide which drops to recommend
    if (eyePower < -1) {
        resultDiv.innerHTML = "For your number, something like <strong>'ClearView Comfort Drops'</strong> might be helpful for distance vision comfort." + importantMessage;
    } else if (eyePower > 1) {
        resultDiv.innerHTML = "For your number, you could look into <strong>'FocusPlus Reading Drops'</strong> to help with close-up tasks." + importantMessage;
    } else {
        resultDiv.innerHTML = "For mild numbers, general purpose <strong>'AquaRefresh Daily Drops'</strong> are often used for moisture." + importantMessage;
    }
}

// Medicine Information Functions
function showMedicineInfo(category) {
    const medicines = {
        'lubricating': {
            title: 'Lubricating Eye Drops',
            icon: 'fas fa-tint',
            color: 'blue',
            medications: [
                {
                    name: 'Artificial Tears (Preservative-free)',
                    dosage: '1-2 drops, 4-6 times daily',
                    instructions: 'Use as needed for dry eye relief',
                    sideEffects: 'Generally well tolerated, temporary blurred vision'
                },
                {
                    name: 'Cyclosporine 0.05% (Restasis)',
                    dosage: '1 drop twice daily',
                    instructions: 'For chronic dry eye, may take 3-6 months for full effect',
                    sideEffects: 'Burning, stinging, eye redness'
                }
            ]
        },
        'antibiotics': {
            title: 'Antibiotic Eye Medications',
            icon: 'fas fa-shield-virus',
            color: 'green',
            medications: [
                {
                    name: 'Erythromycin Ointment',
                    dosage: 'Apply thin ribbon 2-3 times daily',
                    instructions: 'For bacterial conjunctivitis and prevention',
                    sideEffects: 'Temporary blurred vision, eye irritation'
                },
                {
                    name: 'Moxifloxacin (Vigamox)',
                    dosage: '1 drop 3 times daily for 7 days',
                    instructions: 'For bacterial conjunctivitis',
                    sideEffects: 'Eye irritation, altered taste'
                }
            ]
        },
        'anti-inflammatory': {
            title: 'Anti-inflammatory Medications',
            icon: 'fas fa-fire',
            color: 'yellow',
            medications: [
                {
                    name: 'Prednisolone Acetate',
                    dosage: '1-2 drops every 2-4 hours initially',
                    instructions: 'For inflammation, taper dose as directed',
                    sideEffects: 'Increased eye pressure, delayed healing'
                },
                {
                    name: 'Ketorolac (Acular)',
                    dosage: '1 drop 4 times daily',
                    instructions: 'For post-operative inflammation',
                    sideEffects: 'Burning, stinging, corneal effects with prolonged use'
                }
            ]
        },
        'glaucoma': {
            title: 'Glaucoma Medications',
            icon: 'fas fa-eye-slash',
            color: 'red',
            medications: [
                {
                    name: 'Latanoprost (Xalatan)',
                    dosage: '1 drop once daily in the evening',
                    instructions: 'For reducing intraocular pressure',
                    sideEffects: 'Iris color change, eyelash growth, eye redness'
                },
                {
                    name: 'Timolol',
                    dosage: '1 drop twice daily',
                    instructions: 'Beta-blocker for glaucoma treatment',
                    sideEffects: 'May affect heart rate and blood pressure'
                }
            ]
        }
    };
    
    const medicine = medicines[category];
    if (!medicine) return;
    
    const medicineInfo = document.getElementById('medicineInfo');
    const medicineContent = document.getElementById('medicineContent');
    
    medicineContent.innerHTML = `
        <div class="border rounded-xl p-6">
            <h5 class="text-xl font-semibold mb-4 flex items-center text-${medicine.color}-600">
                <i class="${medicine.icon} mr-3"></i>
                ${medicine.title}
            </h5>
            
            <div class="space-y-6">
                ${medicine.medications.map(med => `
                    <div class="bg-${medicine.color}-50 rounded-lg p-4 border border-${medicine.color}-200">
                        <h6 class="font-semibold text-gray-800 mb-3">${med.name}</h6>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="dosage-info">
                                <div class="dosage-icon">
                                    <i class="fas fa-pills"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">Dosage</p>
                                    <p class="text-sm text-gray-600">${med.dosage}</p>
                                </div>
                            </div>
                            
                            <div class="dosage-info">
                                <div class="dosage-icon">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-800">Instructions</p>
                                    <p class="text-sm text-gray-600">${med.instructions}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p class="font-medium text-yellow-800 mb-1">
                                <i class="fas fa-exclamation-triangle mr-2"></i>Possible Side Effects
                            </p>
                            <p class="text-sm text-yellow-700">${med.sideEffects}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="font-medium text-blue-800 mb-2">
                    <i class="fas fa-user-md mr-2"></i>Important Medical Information
                </p>
                <ul class="text-sm text-blue-700 space-y-1">
                    <li>• Always consult with your eye care provider before starting any medication</li>
                    <li>• Follow the prescribed dosage and duration exactly as directed</li>
                    <li>• Report any unusual side effects or worsening symptoms immediately</li>
                    <li>• Do not share eye medications with others</li>
                    <li>• Store medications according to package instructions</li>
                </ul>
            </div>
        </div>
    `;
    
    medicineInfo.classList.remove('hidden');
    medicineInfo.scrollIntoView({ behavior: 'smooth' });
}

// Surgery Assessment Function
function assessSurgery() {
    const eyeCondition = document.getElementById('eyeCondition').value;
    const visionQuality = document.getElementById('visionQuality').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const dailyImpact = document.getElementById('dailyImpact').value;
    
    if (!eyeCondition || !visionQuality || !ageGroup || !dailyImpact) {
        alert('Please fill in all fields for accurate assessment.');
        return;
    }
    
    const assessment = generateSurgeryAssessment(eyeCondition, visionQuality, ageGroup, dailyImpact);
    
    const surgeryResults = document.getElementById('surgeryResults');
    const surgeryContent = document.getElementById('surgeryContent');
    
    surgeryContent.innerHTML = assessment;
    surgeryResults.classList.remove('hidden');
    surgeryResults.scrollIntoView({ behavior: 'smooth' });
}

function generateSurgeryAssessment(condition, vision, age, impact) {
    // Calculate surgery recommendation score
    let score = 0;
    
    // Condition scoring
    const conditionScores = {
        'cataract': 4,
        'glaucoma': 3,
        'retinal_detachment': 5,
        'macular_degeneration': 2,
        'refractive_error': 3,
        'diabetic_retinopathy': 4
    };
    score += conditionScores[condition] || 0;
    
    // Vision quality scoring
    const visionScores = {
        'excellent': 1,
        'good': 2,
        'moderate': 3,
        'poor': 4,
        'severe': 5
    };
    score += visionScores[vision] || 0;
    
    // Impact scoring
    const impactScores = {
        'minimal': 1,
        'moderate': 2,
        'significant': 4,
        'severe': 5
    };
    score += impactScores[impact] || 0;
    
    // Age consideration
    if (age === 'over_60' && condition === 'cataract') score += 2;
    if (age === 'under_40' && condition === 'refractive_error') score += 1;
    
    // Determine recommendation
    let recommendation, urgency, riskLevel;
    
    if (score >= 10) {
        recommendation = 'Surgery Strongly Recommended';
        urgency = 'High Priority - Schedule within 2-4 weeks';
        riskLevel = 'Delaying surgery may lead to permanent vision loss';
    } else if (score >= 7) {
        recommendation = 'Surgery Recommended';
        urgency = 'Moderate Priority - Schedule within 1-2 months';
        riskLevel = 'Benefits likely outweigh risks';
    } else if (score >= 5) {
        recommendation = 'Surgery May Be Beneficial';
        urgency = 'Low Priority - Consider in next 3-6 months';
        riskLevel = 'Discuss options with eye specialist';
    } else {
        recommendation = 'Conservative Treatment Preferred';
        urgency = 'Monitor and reassess in 6-12 months';
        riskLevel = 'Non-surgical options should be tried first';
    }
    
    return `
        <div class="space-y-6">
            <div class="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border">
                <h5 class="text-2xl font-bold text-gray-800 mb-2">${recommendation}</h5>
                <p class="text-lg text-purple-700">${urgency}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="card">
                    <h6 class="font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chart-line mr-2 text-green-500"></i>
                        Assessment Score
                    </h6>
                    <div class="text-center">
                        <div class="text-4xl font-bold text-purple-600 mb-2">${score}/15</div>
                        <div class="progress-bar mb-4">
                            <div class="progress-fill" style="width: ${(score/15)*100}%"></div>
                        </div>
                        <p class="text-sm text-gray-600">Based on condition severity, vision impact, and symptoms</p>
                    </div>
                </div>
                
                <div class="card">
                    <h6 class="font-semibold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>
                        Risk Assessment
                    </h6>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Surgical Risk:</span>
                            <span class="status-badge status-${score >= 10 ? 'normal' : score >= 7 ? 'monitoring' : 'abnormal'}">
                                ${score >= 10 ? 'Low' : score >= 7 ? 'Moderate' : 'Consider Carefully'}
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Success Rate:</span>
                            <span class="font-medium text-green-600">${getSurgerySuccessRate(condition)}</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-3">${riskLevel}</p>
                    </div>
                </div>
            </div>
            
            ${getSurgeryDetails(condition)}
            
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h6 class="font-semibold text-blue-800 mb-3 flex items-center">
                    <i class="fas fa-info-circle mr-2"></i>
                    Next Steps
                </h6>
                <ol class="list-decimal list-inside space-y-2 text-blue-700">
                    <li>Discuss this assessment with your eye care provider</li>
                    <li>Get a comprehensive eye examination</li>
                    <li>Consider a second opinion if surgery is recommended</li>
                    <li>Review your medical history and current medications</li>
                    <li>Understand all risks, benefits, and alternatives</li>
                </ol>
            </div>
        </div>
    `;
}

function getSurgerySuccessRate(condition) {
    const successRates = {
        'cataract': '95-98%',
        'glaucoma': '80-90%',
        'retinal_detachment': '85-95%',
        'macular_degeneration': '60-80%',
        'refractive_error': '90-95%',
        'diabetic_retinopathy': '70-85%'
    };
    return successRates[condition] || '75-90%';
}

function getSurgeryDetails(condition) {
    const surgeryInfo = {
        'cataract': {
            procedure: 'Phacoemulsification with IOL implantation',
            duration: '15-30 minutes per eye',
            recovery: '1-2 weeks for initial healing, 4-6 weeks for complete recovery',
            risks: 'Infection (<1%), retinal detachment (<1%), IOL dislocation (<1%)'
        },
        'glaucoma': {
            procedure: 'Trabeculectomy or drainage device implantation',
            duration: '45-90 minutes',
            recovery: '2-4 weeks for initial healing, 2-3 months for stabilization',
            risks: 'Over-filtration (10-15%), infection (2-5%), cataract formation (15-20%)'
        },
        'refractive_error': {
            procedure: 'LASIK or PRK laser vision correction',
            duration: '15-30 minutes per eye',
            recovery: '1-3 days for LASIK, 1-2 weeks for PRK',
            risks: 'Dry eyes (20-40%), halos/glare (10-20%), under/over-correction (5-10%)'
        }
    };
    
    const info = surgeryInfo[condition];
    if (!info) return '';
    
    return `
        <div class="card">
            <h6 class="font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-procedures mr-2 text-purple-500"></i>
                Surgical Procedure Details
            </h6>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <p class="font-medium text-gray-700 mb-1">Procedure:</p>
                    <p class="text-sm text-gray-600 mb-3">${info.procedure}</p>
                    
                    <p class="font-medium text-gray-700 mb-1">Duration:</p>
                    <p class="text-sm text-gray-600">${info.duration}</p>
                </div>
                <div>
                    <p class="font-medium text-gray-700 mb-1">Recovery Time:</p>
                    <p class="text-sm text-gray-600 mb-3">${info.recovery}</p>
                    
                    <p class="font-medium text-gray-700 mb-1">Main Risks:</p>
                    <p class="text-sm text-gray-600">${info.risks}</p>
                </div>
            </div>
        </div>
    `;
}

// Navigation Functions
function startConsultation() {
    document.getElementById('consultation').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('userMessage').focus();
    }, 500);
}

function analyzeEyePower() {
    document.getElementById('eyepower').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('rightSphere').focus();
    }, 500);
}

// Eye Power Analysis Functions
function analyzeEyePowerNumbers() {
    const rightSphere = parseFloat(document.getElementById('rightSphere').value) || 0;
    const rightCylinder = parseFloat(document.getElementById('rightCylinder').value) || 0;
    const rightAxis = parseFloat(document.getElementById('rightAxis').value) || 0;
    
    const leftSphere = parseFloat(document.getElementById('leftSphere').value) || 0;
    const leftCylinder = parseFloat(document.getElementById('leftCylinder').value) || 0;
    const leftAxis = parseFloat(document.getElementById('leftAxis').value) || 0;
    
    const ageGroup = document.getElementById('eyePowerAge').value;
    const lastTest = document.getElementById('lastEyeTest').value;
    
    if (!ageGroup || !lastTest) {
        showMessage('Please fill in age group and last eye test information.', 'error');
        return;
    }
    
    // Calculate power analysis
    const analysis = calculateEyePowerAnalysis({
        rightEye: { sphere: rightSphere, cylinder: rightCylinder, axis: rightAxis },
        leftEye: { sphere: leftSphere, cylinder: leftCylinder, axis: leftAxis },
        ageGroup: ageGroup,
        lastTest: lastTest
    });
    
    displayEyePowerResults(analysis);
}

function calculateEyePowerAnalysis(eyeData) {
    const { rightEye, leftEye, ageGroup, lastTest } = eyeData;
    
    // Calculate spherical equivalent for both eyes
    const rightSE = rightEye.sphere + (rightEye.cylinder / 2);
    const leftSE = leftEye.sphere + (leftEye.cylinder / 2);
    
    // Classify vision condition
    const rightCondition = classifyVisionCondition(rightSE, rightEye.cylinder);
    const leftCondition = classifyVisionCondition(leftSE, leftEye.cylinder);
    
    // Calculate anisometropia (difference between eyes)
    const anisometropia = Math.abs(rightSE - leftSE);
    
    // Generate recommendations
    const recommendations = generateEyePowerRecommendations(rightCondition, leftCondition, anisometropia, ageGroup, lastTest);
    
    // Calculate progression risk
    const progressionRisk = calculateProgressionRisk(rightSE, leftSE, ageGroup);
    
    return {
        rightEye: {
            ...rightEye,
            sphericalEquivalent: rightSE,
            condition: rightCondition
        },
        leftEye: {
            ...leftEye,
            sphericalEquivalent: leftSE,
            condition: leftCondition
        },
        anisometropia: anisometropia,
        recommendations: recommendations,
        progressionRisk: progressionRisk,
        overallCondition: determineOverallCondition(rightCondition, leftCondition)
    };
}

function classifyVisionCondition(sphericalEquivalent, cylinder) {
    const hasAstigmatism = Math.abs(cylinder) > 0.25;
    let myopiaLevel = 'Normal';
    let severity = 'low';
    
    if (sphericalEquivalent > 0.25) {
        myopiaLevel = 'Hyperopia (Farsightedness)';
        severity = sphericalEquivalent > 3 ? 'high' : sphericalEquivalent > 1 ? 'moderate' : 'low';
    } else if (sphericalEquivalent < -0.25) {
        if (sphericalEquivalent >= -3.00) {
            myopiaLevel = 'Mild Myopia';
            severity = 'low';
        } else if (sphericalEquivalent >= -6.00) {
            myopiaLevel = 'Moderate Myopia';
            severity = 'moderate';
        } else {
            myopiaLevel = 'High Myopia';
            severity = 'high';
        }
    }
    
    return {
        type: myopiaLevel,
        severity: severity,
        astigmatism: hasAstigmatism,
        astigmatismLevel: Math.abs(cylinder)
    };
}

function generateEyePowerRecommendations(rightCondition, leftCondition, anisometropia, ageGroup, lastTest) {
    const recommendations = [];
    
    // General recommendations based on power
    if (rightCondition.severity === 'high' || leftCondition.severity === 'high') {
        recommendations.push({
            priority: 'high',
            category: 'Medical Attention',
            title: 'Comprehensive Eye Examination Required',
            description: 'High refractive error requires professional evaluation for potential complications.',
            actions: ['Schedule ophthalmologist consultation', 'Consider retinal screening', 'Discuss surgical options']
        });
    }
    
    if (anisometropia > 1.5) {
        recommendations.push({
            priority: 'medium',
            category: 'Anisometropia Management',
            title: 'Significant Power Difference Between Eyes',
            description: 'Large difference in eye power may cause visual discomfort and depth perception issues.',
            actions: ['Consider contact lenses over glasses', 'Discuss monovision correction', 'Regular monitoring required']
        });
    }
    
    // Age-specific recommendations
    if (ageGroup === 'child') {
        recommendations.push({
            priority: 'high',
            category: 'Pediatric Care',
            title: 'Growing Eyes Monitoring',
            description: 'Children\'s eyes are still developing and require careful monitoring.',
            actions: ['6-month follow-up examinations', 'Myopia control strategies', 'Limit near work activities']
        });
    }
    
    if (ageGroup === 'senior') {
        recommendations.push({
            priority: 'medium',
            category: 'Age-Related Changes',
            title: 'Presbyopia and Age-Related Considerations',
            description: 'Additional vision changes common after age 50.',
            actions: ['Consider progressive lenses', 'Screen for cataracts and glaucoma', 'Annual comprehensive exams']
        });
    }
    
    // Astigmatism recommendations
    if (rightCondition.astigmatism || leftCondition.astigmatism) {
        const maxAstigmatism = Math.max(rightCondition.astigmatismLevel, leftCondition.astigmatismLevel);
        if (maxAstigmatism > 2.0) {
            recommendations.push({
                priority: 'medium',
                category: 'Astigmatism Correction',
                title: 'Significant Astigmatism Detected',
                description: 'High astigmatism may cause visual distortion and eye strain.',
                actions: ['Consider toric contact lenses', 'Evaluate for LASIK/PRK eligibility', 'Use anti-reflective lens coatings']
            });
        }
    }
    
    // Lifestyle recommendations
    recommendations.push({
        priority: 'low',
        category: 'Eye Health',
        title: 'General Eye Care Recommendations',
        description: 'Maintain optimal eye health with these practices.',
        actions: ['Follow 20-20-20 rule for screen time', 'Wear UV protection outdoors', 'Maintain healthy diet with eye nutrients']
    });
    
    return recommendations;
}

function calculateProgressionRisk(rightSE, leftSE, ageGroup) {
    let riskScore = 0;
    let riskLevel = 'Low';
    let riskFactors = [];
    
    // Age factor
    if (ageGroup === 'child' || ageGroup === 'young_adult') {
        riskScore += 3;
        riskFactors.push('Young age increases progression risk');
    }
    
    // Myopia severity
    const avgMyopia = (Math.abs(Math.min(rightSE, 0)) + Math.abs(Math.min(leftSE, 0))) / 2;
    if (avgMyopia > 6) {
        riskScore += 4;
        riskFactors.push('High myopia increases progression risk');
    } else if (avgMyopia > 3) {
        riskScore += 2;
        riskFactors.push('Moderate myopia may progress');
    }
    
    // Determine risk level
    if (riskScore >= 5) {
        riskLevel = 'High';
    } else if (riskScore >= 3) {
        riskLevel = 'Moderate';
    }
    
    return {
        score: riskScore,
        level: riskLevel,
        factors: riskFactors
    };
}

function determineOverallCondition(rightCondition, leftCondition) {
    const severities = ['low', 'moderate', 'high'];
    const maxSeverity = Math.max(
        severities.indexOf(rightCondition.severity),
        severities.indexOf(leftCondition.severity)
    );
    
    return {
        severity: severities[maxSeverity],
        needsAttention: maxSeverity > 1 || rightCondition.astigmatism || leftCondition.astigmatism
    };
}

function displayEyePowerResults(analysis) {
    const resultsDiv = document.getElementById('eyePowerResults');
    const contentDiv = document.getElementById('eyePowerContent');
    
    contentDiv.innerHTML = generateEyePowerResultsHTML(analysis);
    
    // Create power progression chart
    setTimeout(() => {
        createPowerProgressionChart(analysis);
    }, 100);
    
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateEyePowerResultsHTML(analysis) {
    const { rightEye, leftEye, anisometropia, recommendations, progressionRisk, overallCondition } = analysis;
    
    return `
        <!-- Overall Summary -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <i class="fas fa-eye text-4xl text-blue-600 mb-3"></i>
                <h5 class="font-bold text-xl text-blue-800 mb-2">Overall Condition</h5>
                <p class="text-blue-700 font-semibold">${overallCondition.severity.charAt(0).toUpperCase() + overallCondition.severity.slice(1)} Severity</p>
                <span class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    overallCondition.needsAttention 
                        ? 'bg-yellow-200 text-yellow-800' 
                        : 'bg-green-200 text-green-800'
                }">
                    ${overallCondition.needsAttention ? 'Needs Attention' : 'Routine Care'}
                </span>
            </div>
            
            <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <i class="fas fa-chart-line text-4xl text-purple-600 mb-3"></i>
                <h5 class="font-bold text-xl text-purple-800 mb-2">Progression Risk</h5>
                <p class="text-purple-700 font-semibold">${progressionRisk.level} Risk</p>
                <div class="mt-2 w-full bg-purple-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full" style="width: ${(progressionRisk.score / 7) * 100}%"></div>
                </div>
            </div>
            
            <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <i class="fas fa-balance-scale text-4xl text-green-600 mb-3"></i>
                <h5 class="font-bold text-xl text-green-800 mb-2">Anisometropia</h5>
                <p class="text-green-700 font-semibold">${anisometropia.toFixed(2)}D Difference</p>
                <span class="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    anisometropia > 1.5 
                        ? 'bg-red-200 text-red-800' 
                        : anisometropia > 0.75 
                        ? 'bg-yellow-200 text-yellow-800'
                        : 'bg-green-200 text-green-800'
                }">
                    ${anisometropia > 1.5 ? 'Significant' : anisometropia > 0.75 ? 'Moderate' : 'Normal'}
                </span>
            </div>
        </div>
        
        <!-- Detailed Eye Analysis -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
            <!-- Right Eye -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <h5 class="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <i class="fas fa-eye mr-2"></i>Right Eye (OD) Analysis
                </h5>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-green-700">Spherical Equivalent:</span>
                        <span class="font-bold text-green-800">${rightEye.sphericalEquivalent.toFixed(2)}D</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-green-700">Condition:</span>
                        <span class="font-bold text-green-800">${rightEye.condition.type}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-green-700">Astigmatism:</span>
                        <span class="font-bold text-green-800">
                            ${rightEye.condition.astigmatism ? `${rightEye.condition.astigmatismLevel.toFixed(2)}D` : 'None'}
                        </span>
                    </div>
                    <div class="mt-4">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Severity Level</span>
                            <span class="capitalize">${rightEye.condition.severity}</span>
                        </div>
                        <div class="w-full bg-green-200 rounded-full h-2">
                            <div class="h-2 rounded-full ${
                                rightEye.condition.severity === 'high' ? 'bg-red-500' :
                                rightEye.condition.severity === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                            }" style="width: ${
                                rightEye.condition.severity === 'high' ? '85' :
                                rightEye.condition.severity === 'moderate' ? '60' : '30'
                            }%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Left Eye -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h5 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <i class="fas fa-eye mr-2"></i>Left Eye (OS) Analysis
                </h5>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-blue-700">Spherical Equivalent:</span>
                        <span class="font-bold text-blue-800">${leftEye.sphericalEquivalent.toFixed(2)}D</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-700">Condition:</span>
                        <span class="font-bold text-blue-800">${leftEye.condition.type}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-blue-700">Astigmatism:</span>
                        <span class="font-bold text-blue-800">
                            ${leftEye.condition.astigmatism ? `${leftEye.condition.astigmatismLevel.toFixed(2)}D` : 'None'}
                        </span>
                    </div>
                    <div class="mt-4">
                        <div class="flex justify-between text-sm mb-1">
                            <span>Severity Level</span>
                            <span class="capitalize">${leftEye.condition.severity}</span>
                        </div>
                        <div class="w-full bg-blue-200 rounded-full h-2">
                            <div class="h-2 rounded-full ${
                                leftEye.condition.severity === 'high' ? 'bg-red-500' :
                                leftEye.condition.severity === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                            }" style="width: ${
                                leftEye.condition.severity === 'high' ? '85' :
                                leftEye.condition.severity === 'moderate' ? '60' : '30'
                            }%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Recommendations -->
        <div class="bg-white rounded-xl shadow-lg p-6 border">
            <h5 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <i class="fas fa-lightbulb mr-2 text-yellow-500"></i>
                Personalized Recommendations
            </h5>
            <div class="space-y-4">
                ${recommendations.map(rec => `
                    <div class="border rounded-lg p-4 ${
                        rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                        rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                    }">
                        <div class="flex items-start justify-between mb-3">
                            <h6 class="font-semibold text-gray-800">${rec.title}</h6>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${
                                rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                                rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                            }">
                                ${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm mb-3">${rec.description}</p>
                        <div class="space-y-2">
                            <p class="font-medium text-sm text-gray-700">Recommended Actions:</p>
                            <ul class="list-disc list-inside space-y-1 text-sm text-gray-600">
                                ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Power Progression Risk Factors -->
        ${progressionRisk.factors.length > 0 ? `
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h5 class="text-xl font-bold text-orange-800 mb-4 flex items-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Progression Risk Factors
                </h5>
                <ul class="space-y-2">
                    ${progressionRisk.factors.map(factor => `
                        <li class="flex items-center text-orange-700">
                            <i class="fas fa-circle text-xs mr-3"></i>
                            ${factor}
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
    `;
}

function createPowerProgressionChart(analysis) {
    const ctx = document.getElementById('powerProgressChart');
    if (!ctx) return;
    
    // Sample progression data based on current prescription
    const rightSE = analysis.rightEye.sphericalEquivalent;
    const leftSE = analysis.leftEye.sphericalEquivalent;
    
    // Generate sample historical data
    const years = [];
    const rightData = [];
    const leftData = [];
    
    for (let i = 5; i >= 0; i--) {
        years.push(`${new Date().getFullYear() - i}`);
        // Simulate progression (myopia typically increases over time)
        const progressionFactor = i * 0.25;
        rightData.push(Math.max(rightSE + progressionFactor, -10));
        leftData.push(Math.max(leftSE + progressionFactor, -10));
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Right Eye (OD)',
                data: rightData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }, {
                label: 'Left Eye (OS)',
                data: leftData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Estimated Eye Power Progression'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Diopters (D)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

function initializeSamplePowerChart() {
    const ctx = document.getElementById('powerProgressChart');
    if (!ctx) return;
    
    // Sample data to show chart functionality
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 5; i >= 0; i--) {
        years.push(`${currentYear - i}`);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Sample Right Eye',
                data: [-1.0, -1.5, -2.0, -2.25, -2.5, -2.75],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }, {
                label: 'Sample Left Eye',
                data: [-0.75, -1.25, -1.75, -2.0, -2.25, -2.5],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Sample Eye Power Progression'
                },
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Diopters (D)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message fixed top-4 right-4 z-50 max-w-sm`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Service Worker Registration (for future PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here for PWA functionality
        console.log('App ready for service worker registration');
    });
}