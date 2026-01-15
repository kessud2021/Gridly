require 'webrick'
require 'pathname'

PORT = 3000
SRC_DIR = Pathname.new(__dir__).join('src').realpath
LIB_DIR = Pathname.new(__dir__).join('lib').realpath

server = WEBrick::HTTPServer.new(Port: PORT)

server.mount_proc '/' do |req, res|
  file_path = req.path == '/' ? '/index.html' : req.path

  if file_path.start_with?('/lib/')
    full_path = LIB_DIR.join(file_path[5..-1])
  else
    full_path = SRC_DIR.join(file_path)
  end

  resolved_path = full_path.realpath rescue nil

  allowed_dirs = [SRC_DIR, LIB_DIR]

  unless resolved_path && allowed_dirs.any? { |dir| resolved_path.to_s.start_with?(dir.to_s) }
    res.status = 403
    res['Content-Type'] = 'text/plain'
    res.body = 'Forbidden'
    next
  end

  if File.file?(resolved_path)
    ext = File.extname(resolved_path).downcase
    type_map = {
      '.html' => 'text/html; charset=utf-8',
      '.css' => 'text/css',
      '.js' => 'application/javascript',
      '.json' => 'application/json',
      '.wasm' => 'application/wasm'
    }
    content_type = type_map.fetch(ext, 'text/plain')

    res.status = 200
    res['Content-Type'] = content_type
    res['Access-Control-Allow-Origin'] = '*'
    res['Cache-Control'] = 'no-cache'
    res.body = File.binread(resolved_path)
  else
    res.status = 404
    res['Content-Type'] = 'text/plain'
    res.body = "Not Found: #{file_path}"
  end
end

trap 'INT' do server.shutdown end

puts "🚀 Server running at http://localhost:#{PORT}"
puts "📂 Serving from: #{SRC_DIR}"
puts "📚 Libs from: #{LIB_DIR}"

server.start