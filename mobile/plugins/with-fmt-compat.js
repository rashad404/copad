const { withPodfile } = require("expo/config-plugins");

// SDK 53 includes fmt 11.0.2, whose consteval path fails with newer Apple Clang.
// https://github.com/facebook/react-native/issues/55601
module.exports = (config) =>
  withPodfile(config, (result) => {
    const marker = "# azdoc: fmt 11.0.2 Apple Clang compatibility";
    if (result.modResults.contents.includes(marker)) return result;
    const anchor = "post_install do |installer|";
    if (!result.modResults.contents.includes(anchor))
      throw Error("Cannot locate CocoaPods post_install hook");
    const patch = String.raw`
    ${marker}
    fmt_header = File.join(installer.sandbox.root, 'fmt/include/fmt/base.h')
    if File.exist?(fmt_header)
      fmt_text = File.read(fmt_header)
      fmt_marker = '// azdoc Apple Clang consteval compatibility'
      if fmt_text.include?('#define FMT_VERSION 110002') && !fmt_text.include?(fmt_marker)
        fmt_anchor = "#if FMT_USE_CONSTEVAL\n#  define FMT_CONSTEVAL consteval"
        raise 'Unexpected fmt 11.0.2 header' unless fmt_text.include?(fmt_anchor)
        fmt_override = "#{fmt_marker}\n#if defined(__apple_build_version__) && __clang_major__ >= 17\n#undef FMT_USE_CONSTEVAL\n#define FMT_USE_CONSTEVAL 0\n#endif\n"
        File.chmod(0644, fmt_header)
        File.write(fmt_header, fmt_text.sub(fmt_anchor, fmt_override + fmt_anchor))
      end
    end
`;
    result.modResults.contents = result.modResults.contents.replace(
      anchor,
      anchor + patch,
    );
    return result;
  });
