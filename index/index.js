const fs = require('fs');
const unzip = require('unzipper');
const { BlockType, ArgumentType, formatMessage } = require('scratch-vm/src/extension-support');

class SB3ToJsonExtension {
    getInfo() {
        return {
            id: 'sb3ToJson',
            name: 'SB3 to JSON',
            blocks: [
                {
                    opcode: 'convertToJSON',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'sb3ToJson.convertToJSON',
                        default: 'convert [FILE] to JSON',
                        description: 'Converts an SB3 file to JSON'
                    }),
                    arguments: {
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'project.sb3'
                        }
                    }
                }
            ]
        };
    }

    convertToJSON(args) {
        const { FILE } = args;
        const outputDir = 'output';

        // 创建输出目录
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // 解压 SB3 文件
        fs.createReadStream(FILE)
            .pipe(unzip.Extract({ path: outputDir }))
            .on('close', () => {
                const jsonFilePath = `${outputDir}/project.json`;
                if (fs.existsSync(jsonFilePath)) {
                    console.log(`Converted ${FILE} to JSON: ${jsonFilePath}`);
                    return jsonFilePath;
                } else {
                    console.error('Failed to convert SB3 to JSON');
                    return null;
                }
            });
    }
}

module.exports = SB3ToJsonExtension;