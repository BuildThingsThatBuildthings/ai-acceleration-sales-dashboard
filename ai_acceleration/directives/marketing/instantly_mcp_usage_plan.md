# Instantly MCP Usage Plan

## Overview
The Instantly Model Context Protocol (MCP) server is a standardized bridge that allows this AI Agent to directly control your Instantly account without custom scripts or manual API handling. Instead of writing code, we use **Tools** that the MCP server exposes to the Agent environment.

## 1. Configuration Verification
The connection is established via the `mcp_config.json` file in the Agent's environment.
**Status:** ✅ Configured using Universal Connection URL.
- **Server Name:** `instantly`
- **Connection:** `https://mcp.instantly.ai/mcp/[API_KEY]`

## 2. Available Capabilities (Tools)
Once connected, the Agent (me) has direct access to the following native tools provided by the Instantly MCP server:

### 📧 Campaign Management
- `create_campaign(name, schedule)`: Instantly creates a new campaign container.
- `list_campaigns()`: Retrieves status and metrics of active campaigns.
- `pause_campaign(id)` / `resume_campaign(id)`: Controls campaign execution flow.

### 👥 Lead Management
- `add_leads(campaign_id, leads_list)`: Uploads prospects directly from our research (e.g., processed from Google Sheets).
- `list_leads(campaign_id)`: Checks which leads are queued or completed.

### 📊 Analytics
- `get_campaign_analytics(id)`: Pulls real-time reply rates, open rates, and sending volume.

## 3. Usage Workflow
We do not write Python scripts to "call" these. We simply **instruct the Agent** in natural language, and the Agent selects the correct tool.

### Example: The Full "Sheet to Campaign" Workflow
1.  **Read Data:** Agent reads prompt/sheet to get prospect data.
2.  **Process:** Agent uses internal logic to "casualize" names and generate hooks.
3.  **Execute (MCP):**
    *   *User Instruction:* "Create a campaign named 'Realtor Outreach 2024' and upload these leads."
    *   *Agent Action:* Calls `instantly.create_campaign(name="Realtor Outreach 2024")`.
    *   *Agent Action:* Receives `campaign_id`.
    *   *Agent Action:* Calls `instantly.add_leads(campaign_id=..., leads=[...])`.

## 4. Next Steps
Since the configuration is set, the persistent Agent environment simply needs to reload the context to "see" these tools. Once visible, I will execute the workflow by invoking these tools directly.
