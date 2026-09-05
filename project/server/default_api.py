"""
Default API implementation for web search functionality.
This is a mock implementation that returns sample data.
In a production environment, replace this with actual API calls.
"""
from typing import Dict, Any

async def google_web_search(query: str) -> Dict[str, Any]:
    """
    Mock implementation of Google web search API.
    
    Args:
        query: The search query string
        
    Returns:
        A dictionary containing mock search results
    """
    # Mock response structure similar to what the actual API would return
    return {
        "items": [
            {
                "title": f"Information about {query}",
                "link": f"https://example.com/{query.replace(' ', '_')}",
                "snippet": f"This is a sample description about {query}. In a real implementation, this would contain actual search results.",
                "displayLink": "example.com"
            }
        ]
    }
