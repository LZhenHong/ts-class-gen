#!/bin/bash

# TypeScript Class Generator publish script
# Supports publishing stable and beta versions

set -e  # Exit on error

DIST_DIR="dist"
BETA_TAG="beta"

# Show help information
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -b, --beta     Publish beta version"
    echo "  -p, --patch    Publish patch version (default)"
    echo "  -m, --minor    Publish minor version"
    echo "  -M, --major    Publish major version"
    echo "  -t, --tag TAG  Specify custom version tag"
    echo "  --dry-run      Preview mode, don't actually publish"
    echo ""
    echo "Examples:"
    echo "  $0                # Publish patch version"
    echo "  $0 --beta         # Publish beta version"
    echo "  $0 --minor        # Publish minor version"
    echo "  $0 --tag v1.2.3   # Publish specific version"
    echo "  $0 --dry-run      # Preview mode"
}

# Clean dist directory
clean_dist() {
    if [ -d "$DIST_DIR" ]; then
        echo "🧹 Cleaning $DIST_DIR directory..."
        rm -rf "$DIST_DIR"
    fi
}

# Run tests
run_tests() {
    echo "🧪 Running all tests..."
    npm test
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed! Aborting publish."
        exit 1
    fi
    echo "✅ All tests passed!"
}

# Build project
build_project() {
    echo "🔨 Building project..."
    npm run build
}

# Update version number
update_version() {
    local version_type="$1"
    local custom_tag="$2"
    local is_beta="$3"
    
    if [ -n "$custom_tag" ]; then
        echo "📝 Setting version to: $custom_tag"
        npm version "$custom_tag" --no-git-tag-version
    elif [ "$is_beta" = "true" ]; then
        echo "📝 Updating beta version..."
        npm version prerelease --preid=beta
    else
        echo "📝 Updating $version_type version..."
        npm version "$version_type"
    fi
}

# Publish to npm
publish_package() {
    local is_beta="$1"
    local dry_run="$2"
    
    if [ "$dry_run" = "true" ]; then
        echo "🔍 Preview mode - will not actually publish"
        if [ "$is_beta" = "true" ]; then
            echo "Would execute: npm publish --tag $BETA_TAG --dry-run"
        else
            echo "Would execute: npm publish --dry-run"
        fi
        return
    fi
    
    if [ "$is_beta" = "true" ]; then
        echo "🚀 Publishing beta version to npm..."
        npm publish --tag "$BETA_TAG"
    else
        echo "🚀 Publishing stable version to npm..."
        npm publish
    fi
}

# Main function
main() {
    local version_type="patch"
    local custom_tag=""
    local is_beta="false"
    local dry_run="false"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -b|--beta)
                is_beta="true"
                shift
                ;;
            -p|--patch)
                version_type="patch"
                shift
                ;;
            -m|--minor)
                version_type="minor"
                shift
                ;;
            -M|--major)
                version_type="major"
                shift
                ;;
            -t|--tag)
                custom_tag="$2"
                shift 2
                ;;
            --dry-run)
                dry_run="true"
                shift
                ;;
            *)
                echo "❌ Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo "🎯 Starting publish process..."
    echo ""
    
    # Execute publish steps
    clean_dist
    run_tests
    build_project
    update_version "$version_type" "$custom_tag" "$is_beta"
    publish_package "$is_beta" "$dry_run"
    
    if [ "$dry_run" != "true" ]; then
        echo ""
        echo "✅ Publish completed!"
        
        # Show current version
        current_version=$(node -p "require('./package.json').version")
        echo "📦 Current version: $current_version"
        
        if [ "$is_beta" = "true" ]; then
            echo "🔗 Install command: npm install ts-class-gen@$BETA_TAG"
        else
            echo "🔗 Install command: npm install ts-class-gen"
        fi
    fi
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json file not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main "$@"
