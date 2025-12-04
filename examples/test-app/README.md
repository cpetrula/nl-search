# nl-search Test Application

This is a sample application that demonstrates how to test the `nl-search` package locally without publishing it to the NPM registry.

## Quick Start Guide

### Method 1: Using npm link (Recommended for Active Development)

This method creates a symlink, so changes to nl-search are immediately reflected in this test app.

**Step 1: Link the nl-search package**
```bash
# Navigate to the nl-search root directory
cd ../..

# Install dependencies and build
npm install
npm run build

# Create a global link
npm link
```

**Step 2: Link in this test app**
```bash
# Navigate to this test-app directory
cd examples/test-app

# Link to the nl-search package
npm link nl-search
```

**Step 3: Run the test application**
```bash
npm start
```

**To make changes to nl-search:**
```bash
# Go back to nl-search root
cd ../..

# Make your changes to the source code, then rebuild
npm run build

# The changes are automatically available in test-app
cd examples/test-app
npm start
```

**To unlink when finished:**
```bash
# In test-app directory
npm unlink nl-search

# In nl-search root directory
cd ../..
npm unlink
```

---

### Method 2: Using npm pack

This method creates a tarball file that you can install like a normal package.

**Step 1: Create a tarball**
```bash
# Navigate to the nl-search root directory
cd ../..

# Install dependencies and build
npm install
npm run build

# Create a tarball (creates nl-search-1.0.0.tgz)
npm pack
```

**Step 2: Install the tarball in test-app**
```bash
# Navigate to this test-app directory
cd examples/test-app

# Install from the tarball
npm install ../../nl-search-1.0.0.tgz
```

**Step 3: Run the test application**
```bash
npm start
```

**Note:** If you make changes to nl-search, you must:
1. Run `npm pack` again in the nl-search directory
2. Reinstall in test-app: `npm install ../../nl-search-1.0.0.tgz`

---

### Method 3: Using File Path Installation

This method installs directly from the local directory.

**Step 1: Build nl-search**
```bash
# Navigate to the nl-search root directory
cd ../..

# Install dependencies and build
npm install
npm run build
```

**Step 2: Install from file path**
```bash
# Navigate to this test-app directory
cd examples/test-app

# Install from the parent directory
npm install ../..
```

**Alternative: Add to package.json**

Edit `package.json` and add:
```json
{
  "dependencies": {
    "nl-search": "file:../.."
  }
}
```

Then run:
```bash
npm install
```

**Step 3: Run the test application**
```bash
npm start
```

**Note:** Like npm pack, you need to rebuild and reinstall after changes:
```bash
cd ../..
npm run build
cd examples/test-app
npm install
```

---

## Comparison of Methods

| Method | Best For | Updates | Setup Complexity |
|--------|----------|---------|------------------|
| **npm link** | Active development | Automatic (just rebuild) | Medium |
| **npm pack** | Testing releases | Manual (recreate tarball) | Low |
| **File path** | Simple local testing | Manual (rebuild & reinstall) | Low |

---

## Testing Your Changes

After setting up with any method above, you can:

1. **Run the example:**
   ```bash
   npm start
   ```

2. **Modify `index.js`** to test your own use cases

3. **Test with your own data structures**

4. **Experiment with different queries and options**

---

## Customizing the Test App

Edit `index.js` to test with your own data and queries. The current example uses a library catalog, but you can replace it with any JSON data structure.

Example modifications:

```javascript
// Your custom data
const myData = [
  { name: 'Item 1', category: 'Electronics', price: 299 },
  { name: 'Item 2', category: 'Books', price: 19 }
];

// Test with your queries
const results = search(myData, 'electronics under 300');
console.log(results);
```

---

## Troubleshooting

**Error: Cannot find module 'nl-search'**
- Make sure you've run `npm link nl-search`, `npm install ../../nl-search-1.0.0.tgz`, or `npm install ../..` depending on your chosen method
- Verify that nl-search was built: check that `../../dist/` exists

**Changes not showing up**
- If using npm link: Make sure you ran `npm run build` in the nl-search directory
- If using npm pack or file path: You need to reinstall after changes

**TypeScript errors**
- This is a JavaScript example, but you can convert it to TypeScript if needed
- nl-search includes full TypeScript type definitions

---

## Next Steps

Once you've verified that nl-search works correctly in your test app:

1. Use the same installation method in your actual application
2. For production, install the published package: `npm install nl-search`
3. Check out the main README for complete API documentation
4. Review `examples/demo.js` and `examples/usage.js` for more examples
