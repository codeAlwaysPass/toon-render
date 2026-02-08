# TOON 格式规范

本文档基于 [TOON 官方规范](https://github.com/toon-format/spec/blob/main/SPEC.md) 和 [TOON 官方文档](https://toonformat.dev/)。

## 核心概念

TOON (Token-Oriented Object Notation) 是一种为 LLM 优化的数据格式，结合了 YAML 的缩进结构和 CSV 风格的表格布局。

## 重要规则：表格数组 vs 非均匀数组

### ❌ 错误：表格数组不能包含对象作为列值

```toon
# 这是错误的！表格数组的列值必须是基本类型（字符串、数字、布尔值等）
components[3]{type,props}:
  input,{placeholder:"用户名",type:"text"}  # ❌ props 是对象，不能作为表格列值
```

### ✅ 正确：使用非均匀数组格式

当数组中的对象包含嵌套结构（如对象、数组）时，必须使用**非均匀数组格式**：

```toon
components[3]:
  - type: input
    props:
      placeholder: "用户名"
      type: "text"
      styleClass: "health-input"
  - type: input
    props:
      placeholder: "密码"
      type: "password"
      styleClass: "health-input"
  - type: button
    props:
      label: "登录"
      variant: "primary"
      styleClass: "health-button"
```

## 表格数组格式（Tabular Arrays）

**适用场景**：统一结构的对象数组，所有字段都是基本类型（字符串、数字、布尔值、null）

**语法**：
```
arrayName[N]{field1,field2,field3}:
  value1,value2,value3
  value4,value5,value6
```

**示例**：
```toon
users[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

**关键限制**：
- 每行的值数量必须与字段数量完全匹配
- 列值必须是基本类型（string, number, boolean, null）
- **不能使用对象或数组作为列值**

## 非均匀数组格式（Non-Uniform Arrays）

**适用场景**：包含嵌套结构（对象、数组）的数组

**语法**：
```
arrayName[N]:
  - field1: value1
    field2: value2
    nestedField:
      nestedKey: nestedValue
  - field1: value3
    field2: value4
```

**示例**：
```toon
components[2]:
  - type: button
    props:
      label: "点击我"
      variant: "primary"
  - type: input
    props:
      placeholder: "输入文字"
      type: "text"
```

## 对象格式

**语法**：
```
key: value
nestedKey:
  nestedField: nestedValue
```

**示例**：
```toon
user:
  id: 1
  name: Alice
  profile:
    email: alice@example.com
    role: admin
```

## 数据类型

- **字符串**：`"value"` 或 `value`（如果不需要引号）
- **数字**：`123`, `45.67`
- **布尔值**：`true`, `false`
- **null**：`null`
- **对象**：使用缩进表示嵌套
- **数组**：使用 `-` 前缀或表格格式

## 完整示例对比

### 场景：组件列表（包含 props 对象）

**❌ 错误写法**（会导致解析错误）：
```toon
components[3]{type,props}:
  input,{placeholder:"用户名",type:"text"}
  input,{placeholder:"密码",type:"password"}
  button,{label:"登录",variant:"primary"}
```

**✅ 正确写法**（使用非均匀数组）：
```toon
components[3]:
  - type: input
    props:
      placeholder: "用户名"
      type: "text"
      styleClass: "health-input"
  - type: input
    props:
      placeholder: "密码"
      type: "password"
      styleClass: "health-input"
  - type: button
    props:
      label: "登录"
      variant: "primary"
      styleClass: "health-button"
```

## 总结

1. **表格数组**：仅用于统一结构的基本类型数据
2. **非均匀数组**：用于包含嵌套对象/数组的数据
3. **组件列表**：由于包含 `props` 对象，必须使用非均匀数组格式
4. **解析器限制**：表格数组的列值不能是对象，否则会导致 "Expected N values, but got M" 错误
