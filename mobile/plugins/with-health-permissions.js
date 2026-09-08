const {
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs"),
  path = require("path");
const rationale = "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE";
const texts = {
  az: {
    title: "Sağlamlıq məlumatlarına giriş",
    body: "azdoc yalnız icazə verdiyiniz ölçmələri oxuyur və onları hesabınızdakı öz sağlamlıq qeydlərinizə köçürür. Məlumatlar azdoc serverində saxlanılır. Health Connect-dəki məlumatlar dəyişdirilmir. Əlaqəni tətbiqin Qoşulmuş mənbələr bölməsində kəsə, oxuma icazələrini isə Health Connect-də ləğv edə bilərsiniz. Əlaqəni kəsmək əvvəlki qeydləri silmir. Qeydləri silmək üçün hesabınızdakı məxfilik bölməsini açın.",
    link: "Məxfilik siyasəti",
  },
  en: {
    title: "Access to health data",
    body: "azdoc reads only the measurements you allow and copies them to your own health record in your account. Data is stored on azdoc servers. Data in Health Connect is not changed. You can disconnect in Connected sources and withdraw read permission in Health Connect. Disconnecting does not delete previously imported records. To delete records, open privacy settings in your account.",
    link: "Privacy policy",
  },
  ru: {
    title: "Доступ к данным о здоровье",
    body: "azdoc читает только разрешенные вами показатели и добавляет их в ваши медицинские записи в аккаунте. Данные хранятся на серверах azdoc. Данные в Health Connect не изменяются. Отключить источник можно в разделе Подключенные источники, а отозвать разрешение на чтение - в Health Connect. Отключение не удаляет ранее добавленные записи. Чтобы удалить записи, откройте настройки конфиденциальности в аккаунте.",
    link: "Политика конфиденциальности",
  },
};
module.exports = (config) => {
  config = withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application[0],
      main = app.activity.find((a) => a.$["android:name"] === ".MainActivity");
    if (main)
      main["intent-filter"] = (main["intent-filter"] || []).filter(
        (f) => !f.action?.some((a) => a.$["android:name"] === rationale),
      );
    app.activity = (app.activity || []).filter(
      (a) => a.$["android:name"] !== ".HealthPermissionsActivity",
    );
    app.activity.push({
      $: {
        "android:name": ".HealthPermissionsActivity",
        "android:exported": "true",
      },
      "intent-filter": [{ action: [{ $: { "android:name": rationale } }] }],
    });
    app["activity-alias"] = (app["activity-alias"] || []).filter(
      (alias) => alias.$["android:name"] !== "ViewPermissionUsageActivity",
    );
    app["activity-alias"].push({
      $: {
        "android:name": "ViewPermissionUsageActivity",
        "android:exported": "true",
        "android:targetActivity": ".HealthPermissionsActivity",
        "android:permission": "android.permission.START_VIEW_PERMISSION_USAGE",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "android.intent.action.VIEW_PERMISSION_USAGE",
              },
            },
          ],
          category: [
            {
              $: {
                "android:name": "android.intent.category.HEALTH_PERMISSIONS",
              },
            },
          ],
        },
      ],
    });
    c.modResults.manifest.queries = c.modResults.manifest.queries || [];
    if (
      !c.modResults.manifest.queries.some((q) =>
        q.package?.some(
          (p) => p.$["android:name"] === "com.google.android.apps.healthdata",
        ),
      )
    )
      c.modResults.manifest.queries.push({
        package: [
          { $: { "android:name": "com.google.android.apps.healthdata" } },
        ],
      });
    return c;
  });
  return withDangerousMod(config, [
    "android",
    async (c) => {
      const root = path.join(c.modRequest.platformProjectRoot, "app/src/main"),
        pkg = c.android.package;
      const dir = path.join(root, "java", ...pkg.split("."));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        path.join(dir, "HealthPermissionsActivity.kt"),
        `package ${pkg}
import android.app.Activity
import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Button
class HealthPermissionsActivity : Activity() {
 override fun onCreate(savedInstanceState: Bundle?) {
  super.onCreate(savedInstanceState)
  val density=resources.displayMetrics.density
  val content=LinearLayout(this).apply { orientation=LinearLayout.VERTICAL; val p=(24*density).toInt(); setPadding(p,p,p,p) }
  content.addView(TextView(this).apply { text=getString(R.string.health_privacy_title); textSize=24f })
  content.addView(TextView(this).apply { text=getString(R.string.health_privacy_body); textSize=18f; setPadding(0,(24*density).toInt(),0,(24*density).toInt()) })
  content.addView(Button(this).apply { text=getString(R.string.health_privacy_link); setOnClickListener { startActivity(Intent(Intent.ACTION_VIEW,Uri.parse("https://azdoc.ai/privacy-policy"))) } })
  setContentView(ScrollView(this).apply { fitsSystemWindows=true; addView(content) })
 }
}
`,
      );
      for (const [lang, t] of Object.entries(texts)) {
        const res = path.join(
          root,
          "res",
          lang === "az" ? "values" : `values-${lang}`,
        );
        fs.mkdirSync(res, { recursive: true });
        const xml = (v) =>
          v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/'/g, "\\'");
        fs.writeFileSync(
          path.join(res, "health_permissions.xml"),
          `<resources>${Object.entries(t)
            .map(
              ([key, value]) =>
                `<string name="health_privacy_${key}">${xml(value)}</string>`,
            )
            .join("")}</resources>`,
        );
      }
      return c;
    },
  ]);
};
