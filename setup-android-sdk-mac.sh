#!/bin/bash

# ====================================================================
# Android SDK Environment Setup Script for macOS/Linux
# This script will permanently set Android SDK environment variables
# ====================================================================

echo "Android SDK Environment Setup for macOS/Linux"
echo "=============================================="
echo ""

# Prompt user for Android SDK location
read -p "Enter your Android SDK path (e.g., ~/Library/Android/sdk or /usr/local/android-sdk): " ANDROID_HOME

# Expand tilde to home directory if present
ANDROID_HOME="${ANDROID_HOME/#\~/$HOME}"

# Check if the directory exists
if [ ! -d "$ANDROID_HOME" ]; then
    echo ""
    echo "ERROR: The specified Android SDK path does not exist: $ANDROID_HOME"
    echo "Please check the path and try again."
    exit 1
fi

# Check if platform-tools directory exists
if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
    echo ""
    echo "WARNING: platform-tools directory not found in the Android SDK path."
    echo "Please ensure Android SDK is properly installed."
    exit 1
fi

echo ""
echo "Detecting shell configuration file..."

# Determine which shell config file to use
SHELL_CONFIG=""
CURRENT_SHELL=$(basename "$SHELL")

if [ "$CURRENT_SHELL" = "zsh" ] || [ -f "$HOME/.zshrc" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
    echo "Detected: zsh (using ~/.zshrc)"
elif [ "$CURRENT_SHELL" = "bash" ]; then
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_CONFIG="$HOME/.bash_profile"
        echo "Detected: bash (using ~/.bash_profile)"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_CONFIG="$HOME/.bashrc"
        echo "Detected: bash (using ~/.bashrc)"
    else
        SHELL_CONFIG="$HOME/.bash_profile"
        echo "Detected: bash (will create ~/.bash_profile)"
    fi
else
    # Default to .profile if shell is unknown
    SHELL_CONFIG="$HOME/.profile"
    echo "Using default: ~/.profile"
fi

# Create backup of the config file if it exists
if [ -f "$SHELL_CONFIG" ]; then
    cp "$SHELL_CONFIG" "${SHELL_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "Backup created: ${SHELL_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo ""
echo "Adding Android SDK environment variables to $SHELL_CONFIG..."

# Check if ANDROID_HOME is already set in the config file
if grep -q "ANDROID_HOME" "$SHELL_CONFIG" 2>/dev/null; then
    echo ""
    echo "WARNING: ANDROID_HOME is already defined in $SHELL_CONFIG"
    read -p "Do you want to update it? (y/n): " UPDATE_CHOICE
    if [ "$UPDATE_CHOICE" != "y" ] && [ "$UPDATE_CHOICE" != "Y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
    # Remove old ANDROID_HOME entries
    sed -i.bak '/ANDROID_HOME/d' "$SHELL_CONFIG"
    sed -i.bak '/platform-tools/d' "$SHELL_CONFIG"
fi

# Add Android SDK configuration to the shell config file
cat >> "$SHELL_CONFIG" << EOF

# Android SDK Configuration (Added by setup script on $(date))
export ANDROID_HOME="$ANDROID_HOME"
export PATH="\$PATH:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/tools:\$ANDROID_HOME/tools/bin"
EOF

echo ""
echo "=============================================="
echo "Setup completed successfully!"
echo "=============================================="
echo ""
echo "IMPORTANT: To apply the changes, either:"
echo "  1. Restart your terminal, or"
echo "  2. Run: source $SHELL_CONFIG"
echo ""
echo "You can verify the setup by running:"
echo "  adb --version"
echo ""

# Ask if user wants to apply changes now
read -p "Do you want to apply the changes now? (y/n): " APPLY_NOW
if [ "$APPLY_NOW" = "y" ] || [ "$APPLY_NOW" = "Y" ]; then
    source "$SHELL_CONFIG"
    echo ""
    echo "Changes applied! Checking adb..."
    if command -v adb &> /dev/null; then
        echo "Success! adb is now available:"
        adb --version
    else
        echo "Note: You may need to restart your terminal for adb to be available."
    fi
fi

echo ""
echo "Setup complete!"
