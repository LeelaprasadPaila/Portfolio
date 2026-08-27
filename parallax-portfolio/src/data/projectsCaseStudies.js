export const projectCaseStudies = {
  "Recommendation System": {
    hero: {
      title: "Recommendation System",
      subtitle: "Collaborative filtering model using Matrix Factorization to predict user preferences with high precision",
      banner: "images/projects/project-1-thumb.png",
      technologies: ["Python", "Scikit-learn", "Pandas", "NumPy", "Flask"],
      role: "ML Engineer",
      timeline: "3 Months",
      status: "Completed"
    },
    problem: {
      overview: "Users struggle to discover relevant content across platforms due to information overload. Traditional search methods fail to capture implicit user preferences and behavioral patterns.",
      painPoints: [
        "Users spend 40% of browsing time navigating irrelevant content",
        "Cold-start problem for new users with no interaction history",
        "Sparse user-item interaction matrices lead to poor recommendations",
        "Scalability issues with millions of users and items"
      ],
      existingLimitations: "Rule-based systems and popularity-based recommendations don't capture nuanced user preferences. Content-based filtering lacks serendipity and diversity."
    },
    solution: {
      approach: "Implemented a hybrid recommendation system combining collaborative filtering with matrix factorization techniques to predict user preferences with high precision.",
      keyFeatures: [
        "Matrix Factorization using SVD for latent feature extraction",
        "Hybrid approach combining collaborative and content-based filtering",
        "Real-time recommendation generation with cached pre-computations",
        "A/B testing framework for continuous model improvement"
      ],
      designDecisions: "Chose SVD over neural approaches for interpretability and computational efficiency. Implemented offline training with daily model refresh cycles.",
      engineeringApproach: "Microservices architecture with separate API gateway, recommendation engine, and data pipeline services. Used Redis for caching popular recommendations."
    },
    architecture: {
      systemDesign: "The system follows a Lambda architecture with batch processing for model training and real-time processing for inference.",
      databaseDesign: "PostgreSQL for user-item interactions, MongoDB for catalog data, Redis for caching recommendations",
      apiFlow: "Client -> API Gateway -> Load Balancer -> Recommendation Service -> Model Inference -> Response",
      folderStructure: [
        "src/data_pipeline/ - Data collection and preprocessing",
        "src/models/ - ML model implementations",
        "src/api/ - REST API endpoints",
        "src/evaluation/ - Model evaluation metrics",
        "config/ - Configuration files",
        "tests/ - Unit and integration tests"
      ],
      deploymentWorkflow: "GitHub Actions CI/CD -> Docker Containerization -> Kubernetes Orchestration -> AWS EKS"
    },
    developmentProcess: [
      { phase: "Planning", duration: "2 weeks", tasks: ["Requirements gathering", "System design", "Technology selection"] },
      { phase: "Research", duration: "3 weeks", tasks: ["Literature review", "Algorithm comparison", "Baseline implementation"] },
      { phase: "Development", duration: "6 weeks", tasks: ["Data pipeline", "Model implementation", "API development"] },
      { phase: "Testing", duration: "2 weeks", tasks: ["Unit tests", "Integration tests", "A/B testing setup"] },
      { phase: "Deployment", duration: "1 week", tasks: ["Docker setup", "Kubernetes deployment", "Monitoring setup"] },
      { phase: "Maintenance", duration: "Ongoing", tasks: ["Model retraining", "Performance monitoring", "Feature updates"] }
    ],
    technologies: [
      { name: "Python", icon: "fab fa-python", purpose: "Core programming language", whyChosen: "Rich ML ecosystem", alternatives: "R, Julia" },
      { name: "Scikit-learn", icon: "fas fa-brain", purpose: "ML algorithms", whyChosen: "Production-ready implementations", alternatives: "XGBoost, LightGBM" },
      { name: "Pandas", icon: "fas fa-table", purpose: "Data manipulation", whyChosen: "Efficient data processing", alternatives: "Polars, Dask" },
      { name: "Flask", icon: "fas fa-server", purpose: "API framework", whyChosen: "Lightweight and flexible", alternatives: "FastAPI, Django" }
    ],
    challenges: [
      { title: "Cold Start Problem", description: "New users with no interaction history received poor recommendations. Solved by implementing a popularity-based fallback and demographic profiling.", severity: "High" },
      { title: "Scalability Bottleneck", description: "Matrix factorization computation didn't scale linearly. Implemented mini-batch training and distributed computing with Dask.", severity: "High" },
      { title: "Data Sparsity", description: "99% sparsity in user-item matrix. Applied dimensionality reduction and implicit feedback incorporation.", severity: "Medium" }
    ],
    results: {
      performance: "85% precision@10 on held-out test set",
      metrics: ["45% improvement in user engagement", "60% reduction in search time", "3.2x increase in content discovery"],
      achievements: ["Successfully deployed to production serving 10K+ users", "Reduced infrastructure costs by 40% through optimization"],
      futureRoadmap: ["Deep learning integration for sequential recommendations", "Real-time personalization with online learning", "Multi-modal recommendations (text, image, video)"]
    },
    gallery: [
      { src: "images/projects/project-1-thumb.png", alt: "Recommendation Dashboard", caption: "Main recommendation interface" },
      { src: "images/projects/project-2-thumb.png", alt: "Model Performance", caption: "A/B test results comparison" }
    ],
    resources: {
      github: "https://github.com/leelaprasadpaila/recommendation-system",
      liveDemo: "#",
      documentation: "#",
      presentation: "#"
    },
    relatedProjects: ["Deepfake Detection", "NLP Chatbot", "Stock Price Predictor"]
  },

  "Deepfake Detection": {
    hero: {
      title: "Deepfake Detection",
      subtitle: "CNN-based model to identify manipulated facial features in video content using multiple frame analysis",
      banner: "images/projects/project-2-thumb.png",
      technologies: ["PyTorch", "OpenCV", "Python", "CNN", "Computer Vision"],
      role: "Computer Vision Engineer",
      timeline: "4 Months",
      status: "Completed"
    },
    problem: {
      overview: "The proliferation of deepfake technology poses serious threats to information integrity, privacy, and security. Existing detection methods struggle with high-quality forgeries.",
      painPoints: [
        "Increasing sophistication of deepfake generation techniques",
        "Limited generalization across different datasets and conditions",
        "High computational cost for real-time detection",
        "Lack of robust temporal features in single-frame analysis"
      ],
      existingLimitations: "Traditional forensic methods are ineffective against AI-generated content. Single-frame CNN models miss temporal inconsistencies."
    },
    solution: {
      approach: "Developed a multi-frame CNN architecture that analyzes temporal inconsistencies across video frames, achieving robust detection even with compressed and manipulated content.",
      keyFeatures: [
        "Multi-frame temporal analysis for improved accuracy",
        "Attention mechanism focusing on facial boundary artifacts",
        "Robust to compression, resizing, and color manipulation",
        "Real-time inference at 30 FPS on GPU"
      ],
      designDecisions: "Selected EfficientNet-B0 backbone for optimal accuracy-speed tradeoff. Integrated optical flow features for temporal consistency checking.",
      engineeringApproach: "Modular pipeline with separate preprocessing, feature extraction, and classification stages. Data augmentation for improved generalization."
    },
    architecture: {
      systemDesign: "Three-stage pipeline: Face Detection -> Feature Extraction -> Temporal Classification",
      databaseDesign: "Custom dataset management system with versioned annotations and automated augmentation pipeline",
      apiFlow: "Video Input -> Frame Extraction -> Face Detection -> Feature Extraction -> Classification -> Result",
      folderStructure: [
        "src/detection/ - Face detection and tracking",
        "src/models/ - CNN architecture definitions",
        "src/training/ - Training pipeline and utilities",
        "src/inference/ - Real-time inference engine",
        "data/ - Dataset management scripts",
        "experiments/ - Experiment tracking"
      ],
      deploymentWorkflow: "MLflow for experiment tracking -> ONNX Runtime for deployment -> Docker containerization"
    },
    developmentProcess: [
      { phase: "Research", duration: "4 weeks", tasks: ["Literature survey", "Dataset collection", "Baseline evaluation"] },
      { phase: "Architecture Design", duration: "2 weeks", tasks: ["Model architecture design", "Ablation studies", "Loss function design"] },
      { phase: "Implementation", duration: "6 weeks", tasks: ["Model implementation", "Training pipeline", "Data augmentation"] },
      { phase: "Evaluation", duration: "3 weeks", tasks: ["Cross-dataset evaluation", "Adversarial testing", "Performance optimization"] },
      { phase: "Deployment", duration: "2 weeks", tasks: ["Model optimization", "API development", "Documentation"] }
    ],
    technologies: [
      { name: "PyTorch", icon: "fas fa-fire", purpose: "Deep learning framework", whyChosen: "Research flexibility", alternatives: "TensorFlow, JAX" },
      { name: "OpenCV", icon: "fas fa-eye", purpose: "Image processing", whyChosen: "Comprehensive CV tools", alternatives: "PIL, scikit-image" },
      { name: "Python", icon: "fab fa-python", purpose: "Core programming", whyChosen: "Ecosystem and community", alternatives: "C++, Julia" }
    ],
    challenges: [
      { title: "Dataset Diversity", description: "Models overfit to specific deepfake generation techniques. Solved with extensive data augmentation and multi-dataset training.", severity: "High" },
      { title: "Real-time Performance", description: "Achieving 30 FPS detection on consumer GPUs required significant model optimization and quantization.", severity: "Medium" },
      { title: "Compression Robustness", description: "Video compression artifacts reduced detection accuracy. Implemented multi-resolution analysis.", severity: "Medium" }
    ],
    results: {
      performance: "96.5% accuracy on FaceForensics++ benchmark",
      metrics: ["3.2% improvement over state-of-the-art", "45% faster inference than comparable models", "Works across 5 different deepfake generation methods"],
      achievements: ["Published findings in workshop paper", "Open-sourced model weights", "Deployed as browser extension prototype"],
      futureRoadmap: ["Audio-visual deepfake detection", "Self-supervised pretraining", "On-device deployment for mobile"]
    },
    gallery: [
      { src: "images/projects/project-2-thumb.png", alt: "Detection Interface", caption: "Real-time deepfake detection interface" }
    ],
    resources: {
      github: "https://github.com/leelaprasadpaila/deepfake-detection",
      liveDemo: "#",
      documentation: "#",
      presentation: "#"
    },
    relatedProjects: ["Face Emotion Recognition", "Recommendation System", "Object Segmentation"]
  },

  "NLP Chatbot": {
    hero: {
      title: "NLP Chatbot",
      subtitle: "Transformer-based conversational agent with context-aware responses and sentiment analysis integration",
      banner: "images/projects/project-3-thumb.png",
      technologies: ["TensorFlow", "Transformers", "Python", "NLP", "BERT"],
      role: "NLP Engineer",
      timeline: "3 Months",
      status: "Completed"
    },
    problem: {
      overview: "Customer support teams spend significant time answering repetitive queries. Existing chatbots lack contextual understanding and emotional intelligence.",
      painPoints: [
        "70% of support queries are repetitive and could be automated",
        "Rule-based chatbots fail on complex or nuanced questions",
        "Lack of emotional awareness leads to poor user experience",
        "Context retention across conversation turns is limited"
      ],
      existingLimitations: "Traditional seq2seq models produce generic responses. Intent classification systems cannot handle out-of-scope queries gracefully."
    },
    solution: {
      approach: "Built a transformer-based conversational agent with multi-turn context management, sentiment-aware responses, and dynamic intent routing.",
      keyFeatures: [
        "BERT-based intent classification with 95% accuracy",
        "Multi-turn conversation context management",
        "Sentiment analysis for empathetic response generation",
        "Confidence-based escalation to human agents",
        "Multi-language support through translation pipeline"
      ],
      designDecisions: "Used DistilBERT for production efficiency. Implemented retrieval-augmented generation for factual accuracy.",
      engineeringApproach: "Modular architecture with separate intent classifier, dialogue manager, response generator, and sentiment analyzer."
    },
    architecture: {
      systemDesign: "Pipeline architecture: Input Processing -> Intent Classification -> Context Management -> Response Generation -> Output",
      databaseDesign: "PostgreSQL for conversation history, Redis for session management, Elasticsearch for knowledge base",
      apiFlow: "User Input -> Preprocessing -> Intent Classification -> Context Retrieval -> Response Generation -> Post-processing -> Response",
      folderStructure: [
        "src/intent/ - Intent classification module",
        "src/dialogue/ - Dialogue management system",
        "src/generation/ - Response generation",
        "src/sentiment/ - Sentiment analysis",
        "src/api/ - REST API endpoints",
        "config/ - Model configurations"
      ],
      deploymentWorkflow: "Docker Compose for local dev -> Kubernetes for production -> Nginx reverse proxy -> SSL termination"
    },
    developmentProcess: [
      { phase: "Data Collection", duration: "3 weeks", tasks: ["Conversation data gathering", "Intent labeling", "Dataset preparation"] },
      { phase: "Model Development", duration: "5 weeks", tasks: ["Intent classifier training", "Response generation", "Sentiment integration"] },
      { phase: "Integration", duration: "3 weeks", tasks: ["API development", "Context management", "Frontend integration"] },
      { phase: "Testing", duration: "2 weeks", tasks: ["Conversation flow testing", "Edge case handling", "Performance optimization"] }
    ],
    technologies: [
      { name: "TensorFlow", icon: "fas fa-brain", purpose: "Deep learning framework", whyChosen: "Production deployment tools", alternatives: "PyTorch, JAX" },
      { name: "Transformers", icon: "fas fa-exchange-alt", purpose: "NLP model architecture", whyChosen: "State-of-the-art performance", alternatives: "ULMFiT, ELMo" },
      { name: "Python", icon: "fab fa-python", purpose: "Core programming", whyChosen: "NLP ecosystem", alternatives: "Java, Go" }
    ],
    challenges: [
      { title: "Context Retention", description: "Maintaining conversation context across 10+ turns. Implemented sliding window with summarization.", severity: "High" },
      { title: "Response Consistency", description: "Generating consistent responses across different conversation paths. Added response validation layer.", severity: "Medium" },
      { title: "Latency Optimization", description: "End-to-end latency needed to stay under 500ms. Optimized with model quantization and caching.", severity: "Medium" }
    ],
    results: {
      performance: "95% intent classification accuracy, 4.2/5 user satisfaction score",
      metrics: ["60% reduction in human agent workload", "40% faster query resolution time", "85% first-contact resolution rate"],
      achievements: ["Successfully deployed in production environment", "Handles 1000+ conversations daily", "Integrated with 3 messaging platforms"],
      futureRoadmap: ["Voice integration with speech recognition", "Multi-modal understanding (text + images)", "Continuous learning from conversations"]
    },
    gallery: [
      { src: "images/projects/project-3-thumb.png", alt: "Chatbot Interface", caption: "Conversational AI interface" }
    ],
    resources: {
      github: "https://github.com/leelaprasadpaila/nlp-chatbot",
      liveDemo: "#",
      documentation: "#",
      presentation: "#"
    },
    relatedProjects: ["Face Emotion Recognition", "Recommendation System", "Marketing Insights Hub"]
  }
};