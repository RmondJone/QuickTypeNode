import {
    CPlusPlusTargetLanguage, CSharpTargetLanguage,
    DartTargetLanguage,
    FetchingJSONSchemaStore,
    GoTargetLanguage,
    InputData,
    JavaTargetLanguage,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    KotlinTargetLanguage,
    ObjectiveCTargetLanguage, PythonTargetLanguage,
    quicktype, RustTargetLanguage,
    SwiftTargetLanguage,
    TypeScriptTargetLanguage
} from "../quicktype-core";
import {AcronymStyleOptions} from "../quicktype-core/support/Acronyms";
import {PhpTargetLanguage} from "../quicktype-core/language/Php";

let logger = require('../utils/logger')


/**
 * 注释: 根据JSON字符串生成对应实体
 * 时间: 2021/8/30 0030 13:55
 * @author 郭翰林
 * @returns {Promise<SerializedRenderResult>}
 */
export async function quickTypeByJSON(targetLanguage, typeName, jsonString, options) {
    const jsonInput = jsonInputForTargetLanguage(targetLanguage)

    // We could add multiple samples for the same desired
    // type, or many sources for other types. Here we're
    // just making one type from one piece of sample JSON.
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString],
    })

    const inputData = new InputData()
    inputData.addInput(jsonInput)
    try {
        let result = await quicktype(getTargetLanguageOptions(inputData, targetLanguage, options))
        return conversionResult(result, targetLanguage, options)
    } catch (e) {
        logger.error(e)
        return {
            retCode: -1,
            message: `转换类型异常：${e}`
        }
    }
}

/**
 * 注释: 根据JSONSchema转换为实体
 * 时间: 2021/8/30 0030 14:12
 * @author 郭翰林
 * @param targetLanguage
 * @param typeName
 * @param jsonSchemaString
 * @returns {Promise<string|string>}
 */
export async function quickTypeByJSONSchema(targetLanguage, typeName, jsonSchemaString, options) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore())

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    await schemaInput.addSource({name: typeName, schema: jsonSchemaString})

    const inputData = new InputData()
    inputData.addInput(schemaInput)
    //根据targetLanguage获得目标语言
    try {
        let result = await quicktype(getTargetLanguageOptions(inputData, targetLanguage, options))
        return conversionResult(result, targetLanguage, options)
    } catch (e) {
        logger.error(e)
        return {
            retCode: -1,
            message: `转换类型异常：${e}`
        }
    }
}

/**
 * 注释: 转换结果为String字符串
 * 时间: 2021/8/31 0031 13:43
 * @author 郭翰林
 * @param result
 */
function conversionResult(result, targetLanguage, options) {
    if (result.lines.length > 0) {
        let code = result.lines.join('\n')
        let optionsMap = options ? JSON.parse(options) : {}
        if ('Dart' === targetLanguage) {
            code = code.replace(/Map<String, dynamic>/g, 'Map<dynamic, dynamic>')
        } else if ("Java" === targetLanguage) {
            if (optionsMap['lombok'] ?? false) {
                code = code.replace(/@lombok./g, "@")
            }
        }
        return {
            retCode: 0,
            message: '转换类型成功',
            info: code
        }
    }
    return {
        retCode: -1,
        message: `转换类型异常：结果为空`,
    }
}

/**
 * 注释: 根据字符串获取目标语言
 * 时间: 2021/8/31 0031 8:50
 * @author 郭翰林
 * @param targetLanguage
 */
function getTargetLanguageOptions(inputData, targetLanguage, options) {
    let retOptions
    let retTargetLanguage
    let optionsMap = options ? JSON.parse(options) : {}
    switch (targetLanguage) {
        case 'Kotlin':
            retTargetLanguage = new KotlinTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    framework: 'just-types',
                }
            }
            break
        case 'Dart':
            retTargetLanguage = new DartTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'copy-with': false,
                    'required-props': false,
                    'null-safety': true,
                }
            }
            break
        case 'Java':
            retTargetLanguage = new JavaTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                    "lombok": optionsMap['lombok'] ?? false,
                    'array-type': 'list',
                    'acronym-style': AcronymStyleOptions.Original
                }
            }
            break
        case 'TypeScript':
            retTargetLanguage = new TypeScriptTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true
                }
            }
            break
        case 'C++':
            retTargetLanguage = new CPlusPlusTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true
                }
            }
            break
        case "C#":
            retTargetLanguage = new CSharpTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                    'array-type': 'list',
                }
            }
            break
        case "Rust":
            retTargetLanguage = new RustTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                }
            }
            break
        case "PHP":
            retTargetLanguage = new PhpTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                }
            }
            break
        case "Python":
            retTargetLanguage = new PythonTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                    'python-version': '3.6',
                    'nice-property-names': false
                }
            }
            break
        case 'Swift':
            retTargetLanguage = new SwiftTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true
                }
            }
            break
        case 'Objective-C':
            retTargetLanguage = new ObjectiveCTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true
                }
            }
            break
        case 'Go':
            retTargetLanguage = new GoTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    'just-types': true,
                    'single-comments': optionsMap["singleComments"] ?? true
                }
            }
            break
        default:
            retTargetLanguage = new KotlinTargetLanguage()
            retOptions = {
                inputData: inputData,
                lang: retTargetLanguage,
                rendererOptions: {
                    framework: 'just-types',
                }
            }
            break
    }
    return retOptions
}
