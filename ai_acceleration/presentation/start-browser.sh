#!/bin/bash

# AI Acceleration Presentation Studio Launcher
# This script starts a local web server and opens the presentation studio

echo "🎓 Starting AI Acceleration Presentation Studio..."
echo ""
echo "📂 Server running at: http://localhost:8000"
echo "🎨 Opening presentation studio..."
echo ""
echo "Next steps:"
echo "  1. Click 'Open Presentation Window' in the browser"
echo "  2. Drag presentation window to projector"
echo "  3. Press F11 for fullscreen"
echo ""
echo "Press Ctrl+C to stop the server when done"
echo ""

# Start Python simple HTTP server and open browser
cd "$(dirname "$0")/.." && python3 -m http.server 8000 &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Open browser
open "http://localhost:8000/presentation/presentation-studio.html"

# Wait for Ctrl+C
trap "kill $SERVER_PID; echo ''; echo '✅ Server stopped'; exit" INT
wait
