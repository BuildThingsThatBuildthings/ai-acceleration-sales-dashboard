# Subagents

# Subagents

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Custom subagents in Claude Code are specialized AI assistants that can be invoked to handle specific types of tasks. They enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window.

## What are subagents?

Subagents are pre-configured AI personalities that Claude Code can delegate tasks to. Each subagent:

* Has a specific purpose and expertise area
* Uses its own context window separate from the main conversation
* Can be configured with specific tools it's allowed to use
* Includes a custom system prompt that guides its behavior

When Claude Code encounters a task that matches a subagent's expertise, it can delegate that task to the specialized subagent, which works independently and returns results.

## Key benefits

<CardGroup cols={2}>
  <Card title="Context preservation" icon="layer-group">
    Each subagent operates in its own context, preventing pollution of the main conversation and keeping it focused on high-level objectives.
  </Card>

  <Card title="Specialized expertise" icon="brain">
    Subagents can be fine-tuned with detailed instructions for specific domains, leading to higher success rates on designated tasks.
  </Card>

  <Card title="Reusability" icon="rotate">
    Once created, you can use subagents across different projects and share them with your team for consistent workflows.
  </Card>

  <Card title="Flexible permissions" icon="shield-check">
    Each subagent can have different tool access levels, allowing you to limit powerful tools to specific subagent types.
  </Card>
</CardGroup>

## Quick start

To create your first subagent:

<Steps>
  <Step title="Open the subagents interface">
    Run the following command:

    ```
    /agents
    ```
  </Step>

  <Step title="Select 'Create New Agent'">
    Choose whether to create a project-level or user-level subagent
  </Step>

  <Step title="Define the subagent">
    * **Recommended**: generate with Claude first, then customize to make it yours
    * Describe your subagent in detail, including when Claude should use it
    * Select the tools you want to grant access to, or leave this blank to inherit all tools
    * The interface shows all available tools
    * If you're generating with Claude, you can also edit the system prompt in your own editor by pressing `e`
  </Step>

  <Step title="Save and use">
    Your subagent is now available. Claude uses it automatically when appropriate, or you can invoke it explicitly:

    ```
    > Use the code-reviewer subagent to check my recent changes
    ```
  </Step>
</Steps>

## Subagent configuration

### File locations

Subagents are stored as Markdown files with YAML frontmatter in two possible locations:

| Type                  | Location            | Scope                         | Priority |
| :-------------------- | :------------------ | :---------------------------- | :------- |
| **Project subagents** | `.claude/agents/`   | Available in current project  | Highest  |
| **User subagents**    | `~/.claude/agents/` | Available across all projects | Lower    |

When subagent names conflict, project-level subagents take precedence over user-level subagents.

### Plugin agents

[Plugins](/en/plugins) can provide custom subagents that integrate seamlessly with Claude Code. Plugin agents work identically to user-defined agents and appear in the `/agents` interface.

**Plugin agent locations**: plugins include agents in their `agents/` directory (or custom paths specified in the plugin manifest).

**Using plugin agents**:

* Plugin agents appear in `/agents` alongside your custom agents
* Can be invoked explicitly: "Use the code-reviewer agent from the security-plugin"
* Can be invoked automatically by Claude when appropriate
* Can be managed (viewed, inspected) through `/agents` interface

See the [plugin components reference](/en/plugins-reference#agents) for details on creating plugin agents.

### CLI-based configuration

You can also define subagents dynamically using the `--agents` CLI flag, which accepts a JSON object:

```bash  theme={null}
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

**Priority**: CLI-defined subagents have lower priority than project-level subagents but higher priority than user-level subagents.

**Use case**: This approach is useful for:

* Quick testing of subagent configurations
* Session-specific subagents that don't need to be saved
* Automation scripts that need custom subagents
* Sharing subagent definitions in documentation or scripts

For detailed information about the JSON format and all available options, see the [CLI reference documentation](/en/cli-reference#agents-flag-format).

### File format

Each subagent is defined in a Markdown file with this structure:

```markdown  theme={null}
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all tools if omitted
model: sonnet  # Optional - specify model alias or 'inherit'
permissionMode: default  # Optional - permission mode for the subagent
skills: skill1, skill2  # Optional - skills to auto-load
---

Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach
to solving problems.

Include specific instructions, best practices, and any constraints
the subagent should follow.
```

#### Configuration fields

| Field            | Required | Description                                                                                                                                                                                                     |
| :--------------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`           | Yes      | Unique identifier using lowercase letters and hyphens                                                                                                                                                           |
| `description`    | Yes      | Natural language description of the subagent's purpose                                                                                                                                                          |
| `tools`          | No       | Comma-separated list of specific tools. If omitted, inherits all tools from the main thread                                                                                                                     |
| `model`          | No       | Model to use for this subagent. Can be a model alias (`sonnet`, `opus`, `haiku`) or `'inherit'` to use the main conversation's model. If omitted, defaults to the [configured subagent model](/en/model-config) |
| `permissionMode` | No       | Permission mode for the subagent. Valid values: `default`, `acceptEdits`, `bypassPermissions`, `plan`, `ignore`. Controls how the subagent handles permission requests                                          |
| `skills`         | No       | Comma-separated list of skill names to auto-load when the subagent starts. Skills are loaded into the subagent's context automatically                                                                          |

### Model selection

The `model` field allows you to control which [AI model](/en/model-config) the subagent uses:

* **Model alias**: Use one of the available aliases: `sonnet`, `opus`, or `haiku`
* **`'inherit'`**: Use the same model as the main conversation (useful for consistency)
* **Omitted**: If not specified, uses the default model configured for subagents (`sonnet`)

<Note>
  Using `'inherit'` is particularly useful when you want your subagents to adapt to the model choice of the main conversation, ensuring consistent capabilities and response style throughout your session.
</Note>

### Available tools

Subagents can be granted access to any of Claude Code's internal tools. See the [tools documentation](/en/settings#tools-available-to-claude) for a complete list of available tools.

<Tip>
  **Recommended:** Use the `/agents` command to modify tool access - it provides an interactive interface that lists all available tools, including any connected MCP server tools, making it easier to select the ones you need.
</Tip>

You have two options for configuring tools:

* **Omit the `tools` field** to inherit all tools from the main thread (default), including MCP tools
* **Specify individual tools** as a comma-separated list for more granular control (can be edited manually or via `/agents`)

**MCP Tools**: Subagents can access MCP tools from configured MCP servers. When the `tools` field is omitted, subagents inherit all MCP tools available to the main thread.

## Managing subagents

### Using the /agents command (Recommended)

The `/agents` command provides a comprehensive interface for subagent management:

```
/agents
```

This opens an interactive menu where you can:

* View all available subagents (built-in, user, and project)
* Create new subagents with guided setup
* Edit existing custom subagents, including their tool access
* Delete custom subagents
* See which subagents are active when duplicates exist
* **Manage tool permissions** with a complete list of available tools

### Direct file management

You can also manage subagents by working directly with their files:

```bash  theme={null}
# Create a project subagent
mkdir -p .claude/agents
echo '---
name: test-runner
description: Use proactively to run tests and fix failures
---

You are a test automation expert. When you see code changes, proactively run the appropriate tests. If tests fail, analyze the failures and fix them while preserving the original test intent.' > .claude/agents/test-runner.md

# Create a user subagent
mkdir -p ~/.claude/agents
# ... create subagent file
```

<Note>
  Subagents created by manually adding files will be loaded the next time you start a Claude Code session. To create and use a subagent immediately without restarting, use the `/agents` command instead.
</Note>

## Using subagents effectively

### Automatic delegation

Claude Code proactively delegates tasks based on:

* The task description in your request
* The `description` field in subagent configurations
* Current context and available tools

<Tip>
  To encourage more proactive subagent use, include phrases like "use PROACTIVELY" or "MUST BE USED" in your `description` field.
</Tip>

### Explicit invocation

Request a specific subagent by mentioning it in your command:

```
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error
```

## Built-in subagents

Claude Code includes built-in subagents that are available out of the box:

### General-purpose subagent

The general-purpose subagent is a capable agent for complex, multi-step tasks that require both exploration and action. Unlike the Explore subagent, it can modify files and execute a wider range of operations.

**Key characteristics:**

* **Model**: Uses Sonnet for more capable reasoning
* **Tools**: Has access to all tools
* **Mode**: Can read and write files, execute commands, make changes
* **Purpose**: Complex research tasks, multi-step operations, code modifications

**When Claude uses it:**

Claude delegates to the general-purpose subagent when:

* The task requires both exploration and modification
* Complex reasoning is needed to interpret search results
* Multiple strategies may be needed if initial searches fail
* The task has multiple steps that depend on each other

**Example scenario:**

```
User: Find all the places where we handle authentication and update them to use the new token format

Claude: [Invokes general-purpose subagent]
[Agent searches for auth-related code across codebase]
[Agent reads and analyzes multiple files]
[Agent makes necessary edits]
[Returns detailed writeup of changes made]
```

### Plan subagent

The Plan subagent is a specialized built-in agent designed for use during plan mode. When Claude is operating in plan mode (non-execution mode), it uses the Plan subagent to conduct research and gather information about your codebase before presenting a plan.

**Key characteristics:**

* **Model**: Uses Sonnet for more capable analysis
* **Tools**: Has access to Read, Glob, Grep, and Bash tools for codebase exploration
* **Purpose**: Searches files, analyzes code structure, and gathers context
* **Automatic invocation**: Claude automatically uses this agent when in plan mode and needs to research the codebase

**How it works:**
When you're in plan mode and Claude needs to understand your codebase to create a plan, it delegates research tasks to the Plan subagent. This prevents infinite nesting of agents (subagents cannot spawn other subagents) while still allowing Claude to gather the necessary context.

**Example scenario:**

```
User: [In plan mode] Help me refactor the authentication module

Claude: Let me research your authentication implementation first...
[Internally invokes Plan subagent to explore auth-related files]
[Plan subagent searches codebase and returns findings]
Claude: Based on my research, here's my proposed plan...
```

<Tip>
  The Plan subagent is only used in plan mode. In normal execution mode, Claude uses the general-purpose agent or other custom subagents you've created.
</Tip>

### Explore subagent

The Explore subagent is a fast, lightweight agent optimized for searching and analyzing codebases. It operates in strict read-only mode and is designed for rapid file discovery and code exploration.

**Key characteristics:**

* **Model**: Uses Haiku for fast, low-latency searches
* **Mode**: Strictly read-only - cannot create, modify, or delete files
* **Tools available**:
  * Glob - File pattern matching
  * Grep - Content searching with regular expressions
  * Read - Reading file contents
  * Bash - Read-only commands only (ls, git status, git log, git diff, find, cat, head, tail)

**When Claude uses it:**

Claude will delegate to the Explore subagent when it needs to search or understand a codebase but doesn't need to make changes. This is more efficient than the main agent running multiple search commands directly, as content found during the exploration process doesn't bloat the main conversation.

**Thoroughness levels:**

When invoking the Explore subagent, Claude specifies a thoroughness level:

* **Quick** - Fast searches with minimal exploration. Good for targeted lookups.
* **Medium** - Moderate exploration. Balances speed and thoroughness.
* **Very thorough** - Comprehensive analysis across multiple locations and naming conventions. Used when the target might be in unexpected places.

**Example scenarios:**

```
User: Where are errors from the client handled?

Claude: [Invokes Explore subagent with "medium" thoroughness]
[Explore uses Grep to search for error handling patterns]
[Explore uses Read to examine promising files]
[Returns findings with absolute file paths]
Claude: Client errors are handled in src/services/process.ts:712...
```

```
User: What's the codebase structure?

Claude: [Invokes Explore subagent with "quick" thoroughness]
[Explore uses Glob and ls to map directory structure]
[Returns overview of key directories and their purposes]
```

## Example subagents

### Code reviewer

```markdown  theme={null}
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### Debugger

```markdown  theme={null}
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### Data scientist

```markdown  theme={null}
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

## Best practices

* **Start with Claude-generated agents**: We highly recommend generating your initial subagent with Claude and then iterating on it to make it personally yours. This approach gives you the best results - a solid foundation that you can customize to your specific needs.

* **Design focused subagents**: Create subagents with single, clear responsibilities rather than trying to make one subagent do everything. This improves performance and makes subagents more predictable.

* **Write detailed prompts**: Include specific instructions, examples, and constraints in your system prompts. The more guidance you provide, the better the subagent will perform.

* **Limit tool access**: Only grant tools that are necessary for the subagent's purpose. This improves security and helps the subagent focus on relevant actions.

* **Version control**: Check project subagents into version control so your team can benefit from and improve them collaboratively.

## Advanced usage

### Chaining subagents

For complex workflows, you can chain multiple subagents:

```
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them
```

### Dynamic subagent selection

Claude Code intelligently selects subagents based on context. Make your `description` fields specific and action-oriented for best results.

### Resumable subagents

Subagents can be resumed to continue previous conversations, which is particularly useful for long-running research or analysis tasks that need to be continued across multiple invocations.

**How it works:**

* Each subagent execution is assigned a unique `agentId`
* The agent's conversation is stored in a separate transcript file: `agent-{agentId}.jsonl`
* You can resume a previous agent by providing its `agentId` via the `resume` parameter
* When resumed, the agent continues with full context from its previous conversation

**Example workflow:**

Initial invocation:

```
> Use the code-analyzer agent to start reviewing the authentication module

[Agent completes initial analysis and returns agentId: "abc123"]
```

Resume the agent:

```
> Resume agent abc123 and now analyze the authorization logic as well

[Agent continues with full context from previous conversation]
```

**Use cases:**

* **Long-running research**: Break down large codebase analysis into multiple sessions
* **Iterative refinement**: Continue refining a subagent's work without losing context
* **Multi-step workflows**: Have a subagent work on related tasks sequentially while maintaining context

**Technical details:**

* Agent transcripts are stored in your project directory
* Recording is disabled during resume to avoid duplicating messages
* Both synchronous and asynchronous agents can be resumed
* The `resume` parameter accepts the agent ID from a previous execution

**Programmatic usage:**

If you're using the Agent SDK or interacting with the AgentTool directly, you can pass the `resume` parameter:

```typescript  theme={null}
{
  "description": "Continue analysis",
  "prompt": "Now examine the error handling patterns",
  "subagent_type": "code-analyzer",
  "resume": "abc123"  // Agent ID from previous execution
}
```

<Tip>
  Keep track of agent IDs for tasks you may want to resume later. Claude Code displays the agent ID when a subagent completes its work.
</Tip>

## Performance considerations

* **Context efficiency**: Agents help preserve main context, enabling longer overall sessions
* **Latency**: Subagents start off with a clean slate each time they are invoked and may add latency as they gather context that they require to do their job effectively.

## Related documentation

* [Plugins](/en/plugins) - Extend Claude Code with custom agents through plugins
* [Slash commands](/en/slash-commands) - Learn about other built-in commands
* [Settings](/en/settings) - Configure Claude Code behavior
* [Hooks](/en/hooks) - Automate workflows with event handlers


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://code.claude.com/docs/llms.txt

# Claude Code Docs

## Docs

- [Claude Code on Amazon Bedrock](https://code.claude.com/docs/en/amazon-bedrock.md): Learn about configuring Claude Code through Amazon Bedrock, including setup, IAM configuration, and troubleshooting.
- [Analytics](https://code.claude.com/docs/en/analytics.md): View detailed usage insights and productivity metrics for your organization's Claude Code deployment.
- [Checkpointing](https://code.claude.com/docs/en/checkpointing.md): Automatically track and rewind Claude's edits to quickly recover from unwanted changes.
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web.md): Run Claude Code tasks asynchronously on secure cloud infrastructure
- [CLI reference](https://code.claude.com/docs/en/cli-reference.md): Complete reference for Claude Code command-line interface, including commands and flags.
- [Common workflows](https://code.claude.com/docs/en/common-workflows.md): Learn about common workflows with Claude Code.
- [Manage costs effectively](https://code.claude.com/docs/en/costs.md): Learn how to track and optimize token usage and costs when using Claude Code.
- [Data usage](https://code.claude.com/docs/en/data-usage.md): Learn about Anthropic's data usage policies for Claude
- [Claude Code on desktop](https://code.claude.com/docs/en/desktop.md): Run Claude Code tasks locally or on secure cloud infrastructure with the Claude desktop app
- [Development containers](https://code.claude.com/docs/en/devcontainer.md): Learn about the Claude Code development container for teams that need consistent, secure environments.
- [Claude Code GitHub Actions](https://code.claude.com/docs/en/github-actions.md): Learn about integrating Claude Code into your development workflow with Claude Code GitHub Actions
- [Claude Code GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd.md): Learn about integrating Claude Code into your development workflow with GitLab CI/CD
- [Claude Code on Google Vertex AI](https://code.claude.com/docs/en/google-vertex-ai.md): Learn about configuring Claude Code through Google Vertex AI, including setup, IAM configuration, and troubleshooting.
- [Headless mode](https://code.claude.com/docs/en/headless.md): Run Claude Code programmatically without interactive UI
- [Hooks reference](https://code.claude.com/docs/en/hooks.md): This page provides reference documentation for implementing hooks in Claude Code.
- [Get started with Claude Code hooks](https://code.claude.com/docs/en/hooks-guide.md): Learn how to customize and extend Claude Code's behavior by registering shell commands
- [Identity and Access Management](https://code.claude.com/docs/en/iam.md): Learn how to configure user authentication, authorization, and access controls for Claude Code in your organization.
- [Interactive mode](https://code.claude.com/docs/en/interactive-mode.md): Complete reference for keyboard shortcuts, input modes, and interactive features in Claude Code sessions.
- [JetBrains IDEs](https://code.claude.com/docs/en/jetbrains.md): Use Claude Code with JetBrains IDEs including IntelliJ, PyCharm, WebStorm, and more
- [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance.md): Legal agreements, compliance certifications, and security information for Claude Code.
- [LLM gateway configuration](https://code.claude.com/docs/en/llm-gateway.md): Learn how to configure Claude Code to work with LLM gateway solutions. Covers gateway requirements, authentication configuration, model selection, and provider-specific endpoint setup.
- [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp.md): Learn how to connect Claude Code to your tools with the Model Context Protocol.
- [Manage Claude's memory](https://code.claude.com/docs/en/memory.md): Learn how to manage Claude Code's memory across sessions with different memory locations and best practices.
- [Claude Code on Microsoft Foundry](https://code.claude.com/docs/en/microsoft-foundry.md): Learn about configuring Claude Code through Microsoft Foundry, including setup, configuration, and troubleshooting.
- [Model configuration](https://code.claude.com/docs/en/model-config.md): Learn about the Claude Code model configuration, including model aliases like `opusplan`
- [Monitoring](https://code.claude.com/docs/en/monitoring-usage.md): Learn how to enable and configure OpenTelemetry for Claude Code.
- [Enterprise network configuration](https://code.claude.com/docs/en/network-config.md): Configure Claude Code for enterprise environments with proxy servers, custom Certificate Authorities (CA), and mutual Transport Layer Security (mTLS) authentication.
- [Output styles](https://code.claude.com/docs/en/output-styles.md): Adapt Claude Code for uses beyond software engineering
- [Claude Code overview](https://code.claude.com/docs/en/overview.md): Learn about Claude Code, Anthropic's agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.
- [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces.md): Create and manage plugin marketplaces to distribute Claude Code extensions across teams and communities.
- [Plugins](https://code.claude.com/docs/en/plugins.md): Extend Claude Code with custom commands, agents, hooks, Skills, and MCP servers through the plugin system.
- [Plugins reference](https://code.claude.com/docs/en/plugins-reference.md): Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.
- [Quickstart](https://code.claude.com/docs/en/quickstart.md): Welcome to Claude Code!
- [Sandboxing](https://code.claude.com/docs/en/sandboxing.md): Learn how Claude Code's sandboxed bash tool provides filesystem and network isolation for safer, more autonomous agent execution.
- [Migrate to Claude Agent SDK](https://code.claude.com/docs/en/sdk/migration-guide.md): Guide for migrating the Claude Code TypeScript and Python SDKs to the Claude Agent SDK
- [Security](https://code.claude.com/docs/en/security.md): Learn about Claude Code's security safeguards and best practices for safe usage.
- [Claude Code settings](https://code.claude.com/docs/en/settings.md): Configure Claude Code with global and project-level settings, and environment variables.
- [Set up Claude Code](https://code.claude.com/docs/en/setup.md): Install, authenticate, and start using Claude Code on your development machine.
- [Agent Skills](https://code.claude.com/docs/en/skills.md): Create, manage, and share Skills to extend Claude's capabilities in Claude Code.
- [Claude Code in Slack](https://code.claude.com/docs/en/slack.md): Delegate coding tasks directly from your Slack workspace
- [Slash commands](https://code.claude.com/docs/en/slash-commands.md): Control Claude's behavior during an interactive session with slash commands.
- [Status line configuration](https://code.claude.com/docs/en/statusline.md): Create a custom status line for Claude Code to display contextual information
- [Subagents](https://code.claude.com/docs/en/sub-agents.md): Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.
- [Optimize your terminal setup](https://code.claude.com/docs/en/terminal-config.md): Claude Code works best when your terminal is properly configured. Follow these guidelines to optimize your experience.
- [Enterprise deployment overview](https://code.claude.com/docs/en/third-party-integrations.md): Learn how Claude Code can integrate with various third-party services and infrastructure to meet enterprise deployment requirements.
- [Troubleshooting](https://code.claude.com/docs/en/troubleshooting.md): Discover solutions to common issues with Claude Code installation and usage.
- [Visual Studio Code](https://code.claude.com/docs/en/vs-code.md): Use Claude Code with Visual Studio Code through the native extension or CLI integration
Explain

# Agent Skills

> Create, manage, and share Skills to extend Claude's capabilities in Claude Code.

This guide shows you how to create, use, and manage Agent Skills in Claude Code. Skills are modular capabilities that extend Claude's functionality through organized folders containing instructions, scripts, and resources.

## Prerequisites

* Claude Code version 1.0 or later
* Basic familiarity with [Claude Code](/en/quickstart)

## What are Agent Skills?

Agent Skills package expertise into discoverable capabilities. Each Skill consists of a `SKILL.md` file with instructions that Claude reads when relevant, plus optional supporting files like scripts and templates.

**How Skills are invoked**: Skills are **model-invoked**—Claude autonomously decides when to use them based on your request and the Skill's description. This is different from slash commands, which are **user-invoked** (you explicitly type `/command` to trigger them).

**Benefits**:

* Extend Claude's capabilities for your specific workflows
* Share expertise across your team via git
* Reduce repetitive prompting
* Compose multiple Skills for complex tasks

Learn more in the [Agent Skills overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview).

<Note>
  For a deep dive into the architecture and real-world applications of Agent Skills, read our engineering blog: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Create a Skill

Skills are stored as directories containing a `SKILL.md` file.

### Personal Skills

Personal Skills are available across all your projects. Store them in `~/.claude/skills/`:

```bash  theme={null}
mkdir -p ~/.claude/skills/my-skill-name
```

**Use personal Skills for**:

* Your individual workflows and preferences
* Experimental Skills you're developing
* Personal productivity tools

### Project Skills

Project Skills are shared with your team. Store them in `.claude/skills/` within your project:

```bash  theme={null}
mkdir -p .claude/skills/my-skill-name
```

**Use project Skills for**:

* Team workflows and conventions
* Project-specific expertise
* Shared utilities and scripts

Project Skills are checked into git and automatically available to team members.

### Plugin Skills

Skills can also come from [Claude Code plugins](/en/plugins). Plugins may bundle Skills that are automatically available when the plugin is installed. These Skills work the same way as personal and project Skills.

## Write SKILL.md

Create a `SKILL.md` file with YAML frontmatter and Markdown content:

```yaml  theme={null}
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

**Field requirements**:

* `name`: Must use lowercase letters, numbers, and hyphens only (max 64 characters)
* `description`: Brief description of what the Skill does and when to use it (max 1024 characters)

The `description` field is critical for Claude to discover when to use your Skill. It should include both what the Skill does and when Claude should use it.

See the [best practices guide](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices) for complete authoring guidance including validation rules.

## Add supporting files

Create additional files alongside SKILL.md:

```
my-skill/
├── SKILL.md (required)
├── reference.md (optional documentation)
├── examples.md (optional examples)
├── scripts/
│   └── helper.py (optional utility)
└── templates/
    └── template.txt (optional template)
```

Reference these files from SKILL.md:

````markdown  theme={null}
For advanced usage, see [reference.md](reference.md).

Run the helper script:
```bash
python scripts/helper.py input.txt
```
````

Claude reads these files only when needed, using progressive disclosure to manage context efficiently.

## Restrict tool access with allowed-tools

Use the `allowed-tools` frontmatter field to limit which tools Claude can use when a Skill is active:

```yaml  theme={null}
---
name: safe-file-reader
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
```

When this Skill is active, Claude can only use the specified tools (Read, Grep, Glob) without needing to ask for permission. This is useful for:

* Read-only Skills that shouldn't modify files
* Skills with limited scope: for example, only data analysis, no file writing
* Security-sensitive workflows where you want to restrict capabilities

If `allowed-tools` isn't specified, Claude will ask for permission to use tools as normal, following the standard permission model.

<Note>
  `allowed-tools` is only supported for Skills in Claude Code.
</Note>

## View available Skills

Skills are automatically discovered by Claude from three sources:

* Personal Skills: `~/.claude/skills/`
* Project Skills: `.claude/skills/`
* Plugin Skills: bundled with installed plugins

**To view all available Skills**, ask Claude directly:

```
What Skills are available?
```

or

```
List all available Skills
```

This will show all Skills from all sources, including plugin Skills.

**To inspect a specific Skill**, you can also check the filesystem:

```bash  theme={null}
# List personal Skills
ls ~/.claude/skills/

# List project Skills (if in a project directory)
ls .claude/skills/

# View a specific Skill's content
cat ~/.claude/skills/my-skill/SKILL.md
```

## Test a Skill

After creating a Skill, test it by asking questions that match your description.

**Example**: If your description mentions "PDF files":

```
Can you help me extract text from this PDF?
```

Claude autonomously decides to use your Skill if it matches the request—you don't need to explicitly invoke it. The Skill activates automatically based on the context of your question.

## Debug a Skill

If Claude doesn't use your Skill, check these common issues:

### Make description specific

**Too vague**:

```yaml  theme={null}
description: Helps with documents
```

**Specific**:

```yaml  theme={null}
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

Include both what the Skill does and when to use it in the description.

### Verify file path

**Personal Skills**: `~/.claude/skills/skill-name/SKILL.md`
**Project Skills**: `.claude/skills/skill-name/SKILL.md`

Check the file exists:

```bash  theme={null}
# Personal
ls ~/.claude/skills/my-skill/SKILL.md

# Project
ls .claude/skills/my-skill/SKILL.md
```

### Check YAML syntax

Invalid YAML prevents the Skill from loading. Verify the frontmatter:

```bash  theme={null}
cat SKILL.md | head -n 10
```

Ensure:

* Opening `---` on line 1
* Closing `---` before Markdown content
* Valid YAML syntax (no tabs, correct indentation)

### View errors

Run Claude Code with debug mode to see Skill loading errors:

```bash  theme={null}
claude --debug
```

## Share Skills with your team

**Recommended approach**: Distribute Skills through [plugins](/en/plugins).

To share Skills via plugin:

1. Create a plugin with Skills in the `skills/` directory
2. Add the plugin to a marketplace
3. Team members install the plugin

For complete instructions, see [Add Skills to your plugin](/en/plugins#add-skills-to-your-plugin).

You can also share Skills directly through project repositories:

### Step 1: Add Skill to your project

Create a project Skill:

```bash  theme={null}
mkdir -p .claude/skills/team-skill
# Create SKILL.md
```

### Step 2: Commit to git

```bash  theme={null}
git add .claude/skills/
git commit -m "Add team Skill for PDF processing"
git push
```

### Step 3: Team members get Skills automatically

When team members pull the latest changes, Skills are immediately available:

```bash  theme={null}
git pull
claude  # Skills are now available
```

## Update a Skill

Edit SKILL.md directly:

```bash  theme={null}
# Personal Skill
code ~/.claude/skills/my-skill/SKILL.md

# Project Skill
code .claude/skills/my-skill/SKILL.md
```

Changes take effect the next time you start Claude Code. If Claude Code is already running, restart it to load the updates.

## Remove a Skill

Delete the Skill directory:

```bash  theme={null}
# Personal
rm -rf ~/.claude/skills/my-skill

# Project
rm -rf .claude/skills/my-skill
git commit -m "Remove unused Skill"
```

## Best practices

### Keep Skills focused

One Skill should address one capability:

**Focused**:

* "PDF form filling"
* "Excel data analysis"
* "Git commit messages"

**Too broad**:

* "Document processing" (split into separate Skills)
* "Data tools" (split by data type or operation)

### Write clear descriptions

Help Claude discover when to use Skills by including specific triggers in your description:

**Clear**:

```yaml  theme={null}
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
```

**Vague**:

```yaml  theme={null}
description: For files
```

### Test with your team

Have teammates use Skills and provide feedback:

* Does the Skill activate when expected?
* Are the instructions clear?
* Are there missing examples or edge cases?

### Document Skill versions

You can document Skill versions in your SKILL.md content to track changes over time. Add a version history section:

```markdown  theme={null}
# My Skill

## Version History
- v2.0.0 (2025-10-01): Breaking changes to API
- v1.1.0 (2025-09-15): Added new features
- v1.0.0 (2025-09-01): Initial release
```

This helps team members understand what changed between versions.

## Troubleshooting

### Claude doesn't use my Skill

**Symptom**: You ask a relevant question but Claude doesn't use your Skill.

**Check**: Is the description specific enough?

Vague descriptions make discovery difficult. Include both what the Skill does and when to use it, with key terms users would mention.

**Too generic**:

```yaml  theme={null}
description: Helps with data
```

**Specific**:

```yaml  theme={null}
description: Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with Excel files, spreadsheets, or .xlsx files.
```

**Check**: Is the YAML valid?

Run validation to check for syntax errors:

```bash  theme={null}
# View frontmatter
cat .claude/skills/my-skill/SKILL.md | head -n 15

# Check for common issues
# - Missing opening or closing ---
# - Tabs instead of spaces
# - Unquoted strings with special characters
```

**Check**: Is the Skill in the correct location?

```bash  theme={null}
# Personal Skills
ls ~/.claude/skills/*/SKILL.md

# Project Skills
ls .claude/skills/*/SKILL.md
```

### Skill has errors

**Symptom**: The Skill loads but doesn't work correctly.

**Check**: Are dependencies available?

Claude will automatically install required dependencies (or ask for permission to install them) when it needs them.

**Check**: Do scripts have execute permissions?

```bash  theme={null}
chmod +x .claude/skills/my-skill/scripts/*.py
```

**Check**: Are file paths correct?

Use forward slashes (Unix style) in all paths:

**Correct**: `scripts/helper.py`
**Wrong**: `scripts\helper.py` (Windows style)

### Multiple Skills conflict

**Symptom**: Claude uses the wrong Skill or seems confused between similar Skills.

**Be specific in descriptions**: Help Claude choose the right Skill by using distinct trigger terms in your descriptions.

Instead of:

```yaml  theme={null}
# Skill 1
description: For data analysis

# Skill 2
description: For analyzing data
```

Use:

```yaml  theme={null}
# Skill 1
description: Analyze sales data in Excel files and CRM exports. Use for sales reports, pipeline analysis, and revenue tracking.

# Skill 2
description: Analyze log files and system metrics data. Use for performance monitoring, debugging, and system diagnostics.
```

## Examples

### Simple Skill (single file)

```
commit-helper/
└── SKILL.md
```

```yaml  theme={null}
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best practices

- Use present tense
- Explain what and why, not how
```

### Skill with tool permissions

```
code-reviewer/
└── SKILL.md
```

```yaml  theme={null}
---
name: code-reviewer
description: Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## Review checklist

1. Code organization and structure
2. Error handling
3. Performance considerations
4. Security concerns
5. Test coverage

## Instructions

1. Read the target files using Read tool
2. Search for patterns using Grep
3. Find related files using Glob
4. Provide detailed feedback on code quality
```

### Multi-file Skill

```
pdf-processing/
├── SKILL.md
├── FORMS.md
├── REFERENCE.md
└── scripts/
    ├── fill_form.py
    └── validate.py
```

**SKILL.md**:

````yaml  theme={null}
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages.
---

# PDF Processing

## Quick start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [FORMS.md](FORMS.md).
For detailed API reference, see [REFERENCE.md](REFERENCE.md).

## Requirements

Packages must be installed in your environment:
```bash
pip install pypdf pdfplumber
```
````

<Note>
  List required packages in the description. Packages must be installed in your environment before Claude can use them.
</Note>

Claude loads additional files only when needed.

## Next steps

<CardGroup cols={2}>
  <Card title="Authoring best practices" icon="lightbulb" href="https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices">
    Write Skills that Claude can use effectively
  </Card>

  <Card title="Agent Skills overview" icon="book" href="https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview">
    Learn how Skills work across Claude products
  </Card>

  <Card title="Use Skills in the Agent SDK" icon="cube" href="https://docs.claude.com/en/docs/agent-sdk/skills">
    Use Skills programmatically with TypeScript and Python
  </Card>

  <Card title="Get started with Agent Skills" icon="rocket" href="https://docs.claude.com/en/docs/agents-and-tools/agent-skills/quickstart">
    Create your first Skill
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://code.claude.com/docs/llms.txt
