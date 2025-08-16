# ts-class-gen

A simple and powerful TypeScript class generator library that helps you programmatically generate TypeScript classes, interfaces, methods, and properties with clean, readable code.

## Features

- 🚀 **Simple API** - Easy-to-use fluent interface for code generation
- 📝 **TypeScript Support** - Full TypeScript support with type definitions
- 🎯 **Flexible** - Generate classes, interfaces, methods, properties, and complete files
- 🔧 **Customizable** - Support for access modifiers, static members, inheritance, and more
- 📦 **Lightweight** - Minimal dependencies, focused on core functionality

## Installation

```bash
npm install ts-class-gen
```

## Quick Start

```typescript
import { CGClass, CGProperty, CGMethod, CGFile, CGAccess } from 'ts-class-gen';

// Create a property
const idProperty = new CGProperty();
idProperty.name = 'id';
idProperty.type = 'number';
idProperty.access = CGAccess.private;

// Create a method
const getIdMethod = new CGMethod();
getIdMethod.name = 'getId';
getIdMethod.returnType = 'number';
getIdMethod.access = CGAccess.public;
getIdMethod.addBodyCode('return this.id;');

// Create a class
const userClass = new CGClass();
userClass.name = 'User';
userClass.isExport = true;
userClass.addProperty(idProperty);
userClass.addMethod(getIdMethod);

// Create a file
const file = new CGFile();
file.addClass(userClass);

// Generate the code
console.log(file.toString());
```

This will generate:

```typescript
export class User {
    // #region Properties
    private id: number;
    // #endregion

    // #region Methods
    public getId(): number {
        return this.id;
    }
    // #endregion
}
```

## API Reference

### Core Classes

- **CGClass** - Generate TypeScript classes with properties, methods, inheritance
- **CGInterface** - Generate TypeScript interfaces
- **CGProperty** - Generate class/interface properties with types and access modifiers
- **CGMethod** - Generate methods with parameters and body code
- **CGParameter** - Generate method parameters
- **CGFile** - Generate complete TypeScript files with imports and multiple classes/interfaces

### Enums

- **CGAccess** - Access modifiers: `public`, `private`, `protected`

### Utilities

- **StringBuilder** - Efficient string building
- **CGHelper** - Helper methods for code generation

## Advanced Usage

```typescript
// Complex class with inheritance
const userClass = new CGClass();
userClass.name = 'User';
userClass.extendsClass = 'Person';
userClass.implementsInterfaces = ['IUser'];

// Complete file generation
const file = new CGFile();
file.addImport('import { BaseEntity } from "./base";');
file.addClass(userClass);
const code = file.toString();
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Eden](https://github.com/LZhenHong)
