"""
TIMS Taxonomy - Standalone Flask Application
A simple Flask app serving the TIMS Taxonomy learning framework page.
"""

import os
import hmac
import hashlib
import subprocess
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Webhook secret for authentication
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', 'change-me-in-production')

@app.route('/')
def index():
    """Serve the TIMS Taxonomy page"""
    return render_template('tims.html')

# Research Papers Data
RESEARCH_PAPERS = [
    {
        'id': 1,
        'slug': 'tims-taxonomy-introduction-2015',
        'title': 'Introducing the TIMS Taxonomy: A Modern Framework for Effective Learning',
        'author': 'Dr. Timothy John Hughes',
        'date': '2015-03-15',
        'category': 'Educational Framework',
        'thumbnail': 'static/images/research-1.jpg',
        'excerpt': 'This foundational paper introduces the TIMS Taxonomy, a comprehensive learning framework that emphasizes task understanding, information gathering, meaning-making, and knowledge sharing.',
        'content': {
            'abstract': 'The TIMS Taxonomy represents a paradigm shift in educational methodology, providing educators with a structured approach to designing learning experiences that promote deep understanding and long-term retention.',
            'sections': [
                {
                    'heading': 'Introduction',
                    'content': 'Traditional learning taxonomies have served education well, but the modern learning environment demands a more integrated approach. The TIMS Taxonomy addresses this need by focusing on four interconnected stages of learning.'
                },
                {
                    'heading': 'The Four Stages',
                    'content': 'Try, Improve, Measure, and Stretch represent a cyclical process that mirrors how learners naturally acquire and master new skills.'
                }
            ],
            'images': ['static/images/research-1.jpg'],
            'citations': 15,
            'downloads': 2340
        }
    },
    {
        'id': 2,
        'slug': 'cognitive-patterns-modern-education',
        'title': 'Cognitive Learning Patterns in Modern Education: A Longitudinal Study',
        'author': 'Dr. Sarah Mitchell',
        'date': '2018-09-22',
        'category': 'Research Study',
        'thumbnail': 'static/images/research-2.jpg',
        'excerpt': 'A five-year longitudinal study examining how students engage with the TIMS framework across different educational contexts and age groups.',
        'content': {
            'abstract': 'This comprehensive study tracked 1,200 students across 15 schools over five years, measuring the effectiveness of TIMS-based instruction compared to traditional methods.',
            'sections': [
                {
                    'heading': 'Methodology',
                    'content': 'We employed a mixed-methods approach combining quantitative assessment data with qualitative interviews and classroom observations.'
                },
                {
                    'heading': 'Key Findings',
                    'content': 'Students using TIMS-based instruction showed a 34% improvement in long-term retention and a 28% increase in problem-solving abilities.'
                }
            ],
            'images': ['static/images/research-2.jpg'],
            'citations': 42,
            'downloads': 5680
        }
    },
    {
        'id': 3,
        'slug': 'technology-integration-tims-framework',
        'title': 'Integrating Educational Technology with the TIMS Framework',
        'author': 'Dr. Emily Rodriguez',
        'date': '2020-11-10',
        'category': 'Technology Integration',
        'thumbnail': 'static/images/research-3.jpg',
        'excerpt': 'Exploring how digital tools and platforms can enhance each stage of the TIMS learning cycle in both traditional and remote learning environments.',
        'content': {
            'abstract': 'As education increasingly incorporates technology, this paper examines how digital tools can be strategically aligned with TIMS principles to maximize learning outcomes.',
            'sections': [
                {
                    'heading': 'Digital Tools for Each Stage',
                    'content': 'We identified specific technology categories that support each TIMS stage, from practice apps for Try to collaborative platforms for Stretch.'
                },
                {
                    'heading': 'Implementation Strategies',
                    'content': 'Successful integration requires thoughtful planning and teacher training to ensure technology enhances rather than distracts from learning objectives.'
                }
            ],
            'images': ['static/images/research-3.jpg'],
            'citations': 28,
            'downloads': 4120
        }
    },
    {
        'id': 4,
        'slug': 'assessment-tools-tims-taxonomy',
        'title': 'Developing Assessment Tools Aligned with TIMS Taxonomy',
        'author': 'Dr. Michael Thompson',
        'date': '2021-06-18',
        'category': 'Assessment',
        'thumbnail': 'static/images/research-4.jpg',
        'excerpt': 'A comprehensive guide to creating formative and summative assessments that accurately measure student progress through the TIMS learning stages.',
        'content': {
            'abstract': 'Traditional assessments often fail to capture the full spectrum of learning. This paper presents a framework for developing assessments that align with TIMS principles.',
            'sections': [
                {
                    'heading': 'Assessment Design Principles',
                    'content': 'Effective TIMS-aligned assessments must measure not just knowledge acquisition but also application, reflection, and innovation.'
                },
                {
                    'heading': 'Practical Examples',
                    'content': 'We provide detailed examples of assessment tools for each TIMS stage, including rubrics, self-assessment frameworks, and peer evaluation protocols.'
                }
            ],
            'images': ['static/images/research-4.jpg'],
            'citations': 31,
            'downloads': 3890
        }
    }
]

@app.route('/research')
def research_list():
    """Display list of research papers"""
    return render_template('research.html', papers=RESEARCH_PAPERS)

@app.route('/research/<slug>')
def research_detail(slug):
    """Display individual research paper"""
    paper = next((p for p in RESEARCH_PAPERS if p['slug'] == slug), None)
    if paper is None:
        return "Research paper not found", 404
    return render_template('research_detail.html', paper=paper)

@app.route('/webhook/deploy', methods=['POST'])
def deploy_webhook():
    """
    Webhook endpoint to trigger deployment.
    Validates HMAC signature and executes deploy.sh script.
    """
    # Get the signature from headers
    signature_header = request.headers.get('X-Hub-Signature-256', '')
    
    if not signature_header:
        app.logger.warning('Deployment webhook called without signature')
        return jsonify({'error': 'No signature provided'}), 401
    
    # Verify the signature
    payload = request.get_data()
    expected_signature = 'sha256=' + hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature_header, expected_signature):
        app.logger.warning('Invalid webhook signature')
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Signature is valid, trigger deployment
    app.logger.info('Valid deployment webhook received, triggering deployment...')
    
    try:
        # Get the absolute path to deploy.sh
        deploy_script = os.path.join(os.path.dirname(__file__), 'deploy.sh')
        
        # Execute deployment script in the background
        subprocess.Popen(
            ['bash', deploy_script],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        app.logger.info('Deployment script triggered successfully')
        return jsonify({'status': 'success', 'message': 'Deployment triggered'}), 200
        
    except Exception as e:
        app.logger.error(f'Deployment failed: {str(e)}')
        return jsonify({'error': 'Deployment failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)