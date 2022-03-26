import {
    CPlusPlusTargetLanguage,
    DartTargetLanguage,
    FetchingJSONSchemaStore,
    GoTargetLanguage,
    InputData,
    JavaTargetLanguage,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    KotlinTargetLanguage,
    ObjectiveCTargetLanguage,
    quicktype,
    SwiftTargetLanguage,
    TypeScriptTargetLanguage
} from "../quicktype-core";
import {AcronymStyleOptions} from "../quicktype-core/support/Acronyms";


/**
 * 注释: 根据JSON字符串生成对应实体
 * 时间: 2021/8/30 0030 13:55
 * @author 郭翰林
 * @returns {Promise<SerializedRenderResult>}
 */
export async function quickTypeByJSON(targetLanguage, typeName, jsonString) {
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
    let result = await quicktype(getTargetLanguageOptions(inputData, targetLanguage))
    return conversionResult(result, targetLanguage)
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
export async function quickTypeByJSONSchema(targetLanguage, typeName, jsonSchemaString) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore())

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    await schemaInput.addSource({name: typeName, schema: jsonSchemaString})

    const inputData = new InputData()
    inputData.addInput(schemaInput)
    //根据targetLanguage获得目标语言
    let result = await quicktype(getTargetLanguageOptions(inputData, targetLanguage))
    return conversionResult(result, targetLanguage)
}

/**
 * 注释: 转换结果为String字符串
 * 时间: 2021/8/31 0031 13:43
 * @author 郭翰林
 * @param result
 */
function conversionResult(result, targetLanguage) {
    if (result.lines.length > 0) {
        let code = result.lines.join('\n')
        if ('Dart' === targetLanguage) {
            code = code.replace(/Map<String, dynamic>/g, 'Map<dynamic, dynamic>')
        }
        return code
    }
    return ''
}

/**
 * 注释: 根据字符串获取目标语言
 * 时间: 2021/8/31 0031 8:50
 * @author 郭翰林
 * @param targetLanguage
 */
function getTargetLanguageOptions(inputData, targetLanguage) {
    let retOptions
    let retTargetLanguage
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
                    'null-safety': true
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
                    'just-types': true
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
